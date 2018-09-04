<?php
// this enables autoload. When your dependency is configured for autoloading, then you can just use it without anything else
require __DIR__ . '/vendor/autoload.php';

function main(array $params) : array
{
    $name = $params["name"] ?? "stranger";
    $greeting = "Hello $name!";
    echo $greeting;

    return ["payload" => "Hallo PHP", "htmlText" => "Hallo aus PHP"];
}
?>