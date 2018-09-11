import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import lombok.extern.java.Log;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.util.regex.Pattern;

@Log
public class Schwimmbad {
    public static JsonObject main(JsonObject args) throws IOException {
        Pattern pattern = Pattern.compile("1|2|3|4|5|6|7|8|9|0");
        JsonArray entities = args.getAsJsonArray("entities");
        JsonElement entity = null;

        if ( entities != null && entities.size() > 0) {
            entity = entities.get(0);
        }

        System.out.println("entity name: " + (entity != null ? entity.toString() : ""));
        // Switch zwischen Wochentag und heute
        Document doc = Jsoup.connect("https://www.google.com/search?q=kit+schwimmbad+%C3%B6ffnungszeiten" + (entity != null ? "+" + entity.getAsJsonObject().get("value") : "") + "&ie=utf-8&oe=utf-8&client=firefox-b?lang=de?language=de")
                .header("Accept-Language", "de")
                .get();
        Elements headers = doc.getElementsByClass("kp-header");

        String innerText = headers.get(0).text();
        log.info("innerText: " + innerText);
        String[] split = innerText.split(" ");
        String lastElement = split[split.length-1];

        String[] split1 = lastElement.split(" ");
        String weekday = split1[split1.length - 1];

        StringBuilder payload = new StringBuilder("Am " + weekday + " hat das KIT-Schwimmbad ");
        int count= 0;

        // Payload zusammen bauen
        for (String element = split[0]; count < split.length; count++) {
            log.info("In Schleifendurchlauf: " + (count + 1) + "\nelement:" + element);

            if (pattern.matcher(element).find()) {
                String[] fromTo = element.split("–");

                System.out.println("count: " + count);
                System.out.println("gesamt: " + split.length);
                if (count == 2 || (count == 1 && !pattern.matcher(split[count+1]).find())) {
                    // Füge die letzte Zeile hinzu
                    payload.append(("und von " + fromTo[0] + " Uhr bis " + fromTo[1] + " Uhr geöffnet."));
                } else {
                    // Füge eine Uhrzeit hinzu
                    payload.append(("von " + fromTo[0] + " Uhr bis " + fromTo[1] + " Uhr; "));
                }
            }
            if (count != split.length-1)
                element = split[count+1];
        }

        // Wenn nichts dem payload hinzugefügt wurde, dann könnte nur ein Text, ohne Ziffern, beinhaltet sein
        if (payload.length() == 0)
            payload.append(split[0]);

        JsonObject response = new JsonObject();
        response.addProperty("payload", payload.toString());
        return response;
    }
}