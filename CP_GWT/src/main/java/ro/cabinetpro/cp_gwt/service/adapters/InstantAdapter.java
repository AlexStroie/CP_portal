package ro.cabinetpro.cp_gwt.service.adapters;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import java.lang.reflect.Type;
import java.time.Instant;

public class InstantAdapter implements JsonSerializer<Instant>, JsonDeserializer<Instant> {

    @Override
    public JsonElement serialize(Instant src, Type typeOfSrc, JsonSerializationContext context) {
        // poți serializa tot ca double epoch seconds
        double epochSeconds = src.getEpochSecond() + src.getNano() / 1_000_000_000.0;
        return new JsonPrimitive(epochSeconds);
    }

    @Override
    public Instant deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) {
        if (json.isJsonPrimitive() && json.getAsJsonPrimitive().isNumber()) {
            double epochSeconds = json.getAsDouble();
            long seconds = (long) epochSeconds;
            long nanos = (long) ((epochSeconds - seconds) * 1_000_000_000);
            return Instant.ofEpochSecond(seconds, nanos);
        }
        throw new JsonParseException("Invalid epoch instant: " + json);
    }
}
