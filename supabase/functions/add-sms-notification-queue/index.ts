import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "" // DİKKAT: service_role key!
    );

    const { phoneNumber, auctionId } = await req.json();

    if (!phoneNumber || !auctionId) {
      return new Response(
        JSON.stringify({ success: false, error: "phoneNumber ve auctionId zorunlu!" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Aynı kayıt var mı kontrol et
    const { data: existing, error: checkError } = await supabaseClient
      .from("sms_notification_queue")
      .select("id")
      .eq("auction_id", auctionId)
      .eq("phone_number", phoneNumber)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }
    if (existing) {
      return new Response(
        JSON.stringify({ success: true, message: "Zaten kayıtlı." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Kuyruğa ekle
    const { error } = await supabaseClient.from("sms_notification_queue").insert({
      auction_id: auctionId,
      phone_number: phoneNumber,
      message: "Auction start notification",
      type: "auction_start_notification",
      status: "pending",
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, message: "Kuyruğa eklendi." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Bilinmeyen hata" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}); 