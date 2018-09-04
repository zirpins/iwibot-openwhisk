package de.hska.iwibot.actions.java;

import com.google.gson.JsonObject;

public class Template {
    public static JsonObject main(JsonObject args) {
        String name = "stranger";
        if (args.has("name"))
            name = args.getAsJsonPrimitive("name").getAsString();
        JsonObject response = new JsonObject();
        response.addProperty("greeting", "Hello " + name + "!");
        response.addProperty("payload", "Hallo Java");
        response.addProperty("htmlText", "Hallo aus Java!");
        return response;
    }
}