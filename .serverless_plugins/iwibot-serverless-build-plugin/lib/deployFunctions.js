"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const JSZip = require("jszip");
const fs = require("fs");
const c = require("chalk");
const child_process_1 = require("child_process");
const path_1 = require("path");
function deployFunctions() {
    this.serverless.cli.log('Deploying Functions...');
    filterActions.bind(this)().then(names => {
        return deployActions.bind(this)(names);
    });
}
exports.deployFunctions = deployFunctions;
function deploySequences() {
    filterActions.bind(this)(true).then(sequences => {
        if (sequences.length) {
            this.serverless.cli.log('Deploying Sequences...');
        }
        return deployActions.bind(this)(sequences);
    });
}
exports.deploySequences = deploySequences;
function calculateFunctionMain(functionObject) {
    const splitted = functionObject.handler.split('.');
    if (functionObject.runtime === 'java') {
        return functionObject.handler;
    }
    if (splitted.length < 2) {
        return functionObject;
    }
    return splitted[splitted.length - 1];
}
function filterActions(sequence) {
    return __awaiter(this, void 0, void 0, function* () {
        const functionsObj = this.serverless.service.functions;
        const kind = action => action.runtime; // TODO: sequence !!
        const match = action => ((kind(action) === 'sequence') === !!sequence);
        return Object.keys(functionsObj).filter(a => match(functionsObj[a]));
    });
}
function convertAnnotations(annotations) {
    if (!annotations) {
        return {};
    }
    return Object.keys(annotations).map((ano) => {
        return { key: ano, value: annotations[ano] };
    });
}
function getArtifactZip(runtime, name) {
    const artifactPath = getArtifactPath.bind(this)(runtime, name);
    const readFile = Bluebird.promisify(fs.readFile);
    return readFile(artifactPath).then(zipBuffer => JSZip.loadAsync(zipBuffer));
}
function getArtifactPath(runtime, name) {
    const ext = runtime.indexOf('java') > -1 ? '.jar' : '.zip';
    return path_1.join(path_1.resolve('.serverless'), name + ext);
}
function deployActions(names) {
    const functions = this.serverless.service.functions;
    return Bluebird.all(names.map(name => {
        return new Promise(((resolveProm, reject) => {
            if (functions[name].enabled) {
                if (functions[name].runtime === 'blackbox') {
                    // handle binary actions
                    const res = child_process_1.spawn('ibmcloud', ['fn', 'action', 'update', name, '--native', path_1.join(path_1.resolve('.serverless'), name + '.zip')]);
                    res.stdout.on('data', (data) => {
                        console.log('' + data);
                    });
                    res.on('close', (code) => {
                        if (code === 0) {
                            this.logger.log('binary function created');
                            resolveProm();
                        }
                        else {
                            this.logger.error('error creating binary function');
                            reject();
                        }
                    });
                }
                else {
                    // handle action with specific kind/runtime
                    deployFunctionHandler.bind(this)(functions[name]);
                    resolveProm();
                }
            }
            else {
                this.logger.message('Function', c.reset.bold(name) + c.red(' is excluded from deployment'));
                resolveProm();
            }
        }));
    }));
}
function deployFunctionHandler(functionHandler) {
    return __awaiter(this, void 0, void 0, function* () {
        const props = yield this.serverless.getProvider('openwhisk').props();
        functionHandler.actionName = functionHandler.name;
        functionHandler.namespace = props['namespace'];
        functionHandler.overwrite = true;
        functionHandler.action = {
            exec: {
                main: calculateFunctionMain.bind(this)(functionHandler),
                kind: functionHandler.runtime
            },
            limits: {},
        };
        try {
            const zip = yield getArtifactZip.bind(this)(functionHandler.runtime, functionHandler.name);
            const buf = yield zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } });
            functionHandler.action.exec.code = buf.toString('base64');
        }
        catch (e) {
            throw new Error(e);
        }
        if (functionHandler.annotations) {
            Object.assign(functionHandler.action, { annotations: convertAnnotations(functionHandler.annotations) });
        }
        return this.provider.client().then(ow => {
            if (this.options.verbose) {
                this.serverless.cli.log(`Deploying Function: ${functionHandler.actionName}`);
            }
            return ow.actions.update(functionHandler)
                .then(() => {
                if (this.options.verbose) {
                    this.serverless.cli.log(`Deployed Function: ${functionHandler.actionName}`);
                }
            })
                .catch(err => {
                throw new this.serverless.classes.Error(`Failed to deploy function (${JSON.stringify(functionHandler, null, 2)}) due to error: ${err.message}`);
            });
        });
    });
}
