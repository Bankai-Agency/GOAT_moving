#!/usr/bin/env python3
"""Build the GTM container for thegoatmovers.net as an import file.

    /usr/bin/python3 scripts/gtm-build-container.py

Writes docs/gtm/container-import.json. Import it in GTM: Admin -> Import
Container -> Existing workspace -> Overwrite. The layout follows
docs/GTM-CLEANUP.md: every working tag of the old container GTM-W5VQHNGV
(rebuilt from its published gtm.js, version 76) with the cleanup already
applied. Plain data, no network: change a value here and rebuild.
"""

import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "gtm", "container-import.json")
SOURCEBUSTER = os.path.join(ROOT, "scripts", "gtm", "sourcebuster.html")

GA4_ID = "G-ZWKYKS6SB2"
ADS_ID = "303316957"
ADS_LABEL = "giGdCIj-2LEZEN3_0JAB"
CLARITY_PROJECT = "md9tf0il0l"
CALLRAIL_SWAP = "//cdn.callrail.com/companies/250387318/3c306e08c142560a8bbf/12/swap.js"

# Apps Script web hooks of the old container, one per Google Sheet log.
HOOK_LEAD = "https://script.google.com/macros/s/AKfycbzpmrk5OgdREZpOXzxECePFK4sKJ3FVq0U2VKzS5Biv3vkJnGoKDhMdT82ytrZAA_Y6/exec"
HOOK_PHONE = "https://script.google.com/macros/s/AKfycbzrZYHleTixtB67BYnYkE7WmRCZQEYIE7V8CyUTeQiHgycZqt3m2KbrairhNOs71hPeAw/exec"
HOOK_ABANDONED = "https://script.google.com/macros/s/AKfycbwPNjJD62tmWjLI-qIAsTzPsmAWNXOYlKjXsXYtU_tgPBeGOIVH3g0L4fxQu4Jlnc8y8A/exec"
HOOK_PAGEVIEW = "https://script.google.com/macros/s/AKfycbyZPFysMVxo58f2F2yOkJ-awIFo11fvdQVfKADa4jSrfShj_hUtO-qcRrFN3S7fqHxi/exec"

ALL_PAGES = "2147479553"
INITIALIZATION = "2147479573"

ACCOUNT = "0"
CONTAINER = "0"


# --- parameter helpers -------------------------------------------------------

def tpl(key, value):
    return {"type": "TEMPLATE", "key": key, "value": value}


def boolean(key, value):
    return {"type": "BOOLEAN", "key": key, "value": "true" if value else "false"}


def integer(key, value):
    return {"type": "INTEGER", "key": key, "value": str(value)}


def event_params(pairs):
    return {
        "type": "LIST",
        "key": "eventSettingsTable",
        "list": [
            {"type": "MAP", "map": [tpl("parameter", k), tpl("parameterValue", v)]}
            for k, v in pairs
        ],
    }


def condition(op, left, right, ignore_case=False):
    params = [tpl("arg0", left), tpl("arg1", right)]
    if ignore_case:
        params.append(boolean("ignore_case", True))
    return {"type": op, "parameter": params}


# --- entities ----------------------------------------------------------------

class Builder:
    def __init__(self):
        self.tags = []
        self.triggers = []
        self.variables = []
        self.trigger_ids = {}

    def trigger(self, name, ttype, **extra):
        tid = str(len(self.triggers) + 1)
        entry = {"accountId": ACCOUNT, "containerId": CONTAINER, "triggerId": tid,
                 "name": name, "type": ttype, "fingerprint": "0"}
        entry.update(extra)
        self.triggers.append(entry)
        self.trigger_ids[name] = tid
        return tid

    def variable(self, name, vtype, params):
        vid = str(len(self.variables) + 1)
        self.variables.append({"accountId": ACCOUNT, "containerId": CONTAINER,
                               "variableId": vid, "name": name, "type": vtype,
                               "parameter": params, "fingerprint": "0"})

    def tag(self, name, ttype, params, triggers, once=True):
        tid = str(len(self.tags) + 1)
        firing = [self.trigger_ids.get(t, t) for t in triggers]
        self.tags.append({
            "accountId": ACCOUNT, "containerId": CONTAINER, "tagId": tid,
            "name": name, "type": ttype, "parameter": params, "fingerprint": "0",
            "firingTriggerId": firing,
            "tagFiringOption": "ONCE_PER_EVENT" if once else "UNLIMITED",
            "monitoringMetadata": {"type": "MAP"},
            "consentSettings": {"consentStatus": "NOT_SET"},
        })


def js(fn_body):
    """Custom JavaScript variable source: an anonymous function."""
    return "function(){" + fn_body + "}"


def html_tag(code):
    return [tpl("html", code), boolean("supportDocumentWrite", False)]


def image_tag(url):
    return [boolean("useCacheBuster", True), tpl("url", url),
            tpl("cacheBusterQueryParam", "gtmcb")]


def build():
    b = Builder()

    # ---- triggers -------------------------------------------------------
    b.trigger("Lead - generate_lead", "CUSTOM_EVENT",
              customEventFilter=[condition("EQUALS", "{{_event}}", "generate_lead")])
    b.trigger("Custom Event - abandoned_form", "CUSTOM_EVENT",
              customEventFilter=[condition("EQUALS", "{{_event}}", "abandoned_form")])
    b.trigger("Click - Phone link (tel:)", "LINK_CLICK",
              filter=[condition("CONTAINS", "{{Click URL}}", "tel:")],
              waitForTags={"type": "BOOLEAN", "value": "false"},
              checkValidation={"type": "BOOLEAN", "value": "false"},
              waitForTagsTimeout={"type": "TEMPLATE", "value": "2000"},
              uniqueTriggerId={"type": "TEMPLATE", "value": ""})
    # The sheet logs for page views and phone clicks only cover ad visits
    # (gclid / gbraid / wbraid in the URL), as in the old container.
    b.trigger("Click - Phone link (tel:) - Ad visit", "LINK_CLICK",
              filter=[condition("CONTAINS", "{{Click URL}}", "tel:"),
                      condition("EQUALS", "{{JS - Ad click id present}}", "true")],
              waitForTags={"type": "BOOLEAN", "value": "false"},
              checkValidation={"type": "BOOLEAN", "value": "false"},
              waitForTagsTimeout={"type": "TEMPLATE", "value": "2000"},
              uniqueTriggerId={"type": "TEMPLATE", "value": ""})
    b.trigger("Window Loaded - Ad visit", "WINDOW_LOADED",
              filter=[condition("EQUALS", "{{JS - Ad click id present}}", "true")])
    b.trigger("Click - Request a Quote", "CLICK",
              filter=[condition("MATCH_REGEX", "{{Click Text}}", "request a quote", ignore_case=True)])
    b.trigger("Page View - Thank you", "PAGEVIEW",
              filter=[condition("CONTAINS", "{{Page Path}}", "/thank-you")])
    b.trigger("DOM Ready - All Pages", "DOM_READY")
    b.trigger("Window Loaded - All Pages", "WINDOW_LOADED")

    # ---- variables ------------------------------------------------------
    b.variable("Const - GA4 Measurement ID", "c", [tpl("value", GA4_ID)])
    b.variable("Const - Ads Conversion ID", "c", [tpl("value", ADS_ID)])

    for key in ("form_location", "city", "lead_name", "lead_email", "lead_phone"):
        b.variable("DL - " + key, "v", [integer("dataLayerVersion", 2),
                                        boolean("setDefaultValue", False),
                                        tpl("name", key)])

    b.variable("UPD - Lead", "awec", [tpl("mode", "MANUAL"),
                                      tpl("email", "{{DL - lead_email}}"),
                                      tpl("phone_number", "{{DL - lead_phone}}")])

    for label, field in (("source", "src"), ("medium", "mdm"), ("campaign", "cmp"),
                         ("term", "trm"), ("content", "cnt")):
        b.variable("JS - sbjs " + label, "j", [tpl("name", "sbjs.get.current." + field)])

    b.variable("JS - Date formatted", "jsm", [tpl("javascript", js(
        'var a=new Date,c=-a.getTimezoneOffset(),e=c>=0?"+":"-",d=Math.abs(c);'
        'c=Math.floor(d/60);d%=60;var b=function(f){return("0"+f).slice(-2)},'
        'g=a.getFullYear(),h=b(a.getMonth()+1),k=b(a.getDate()),l=b(a.getHours()),'
        'm=b(a.getMinutes());a=b(a.getSeconds());'
        'return g+"-"+h+"-"+k+" "+l+":"+m+":"+a+e+b(c)+":"+b(d)'))])
    b.variable("JS - Device", "jsm", [tpl("javascript", js(
        'var a=navigator.userAgent;return/Mobile|Android|iP(hone|od)/.test(a)?"Mobile":'
        '/iPad|Tablet|PlayBook/.test(a)?"Tablet":"Desktop"'))])
    b.variable("JS - OS", "jsm", [tpl("javascript", js(
        'var a=navigator.userAgent;return/Windows NT/.test(a)?"Windows":'
        '/Macintosh|Mac OS X/.test(a)?"macOS":/Android/i.test(a)?"Android":'
        '/iPhone|iPad|iPod/.test(a)?"iOS":/Linux/.test(a)?"Linux":"Unknown"'))])
    b.variable("Cookie - _ga", "k", [boolean("decodeCookie", False), tpl("name", "_ga")])
    b.variable("JS - GA Client ID", "jsm", [tpl("javascript", js(
        'try{var a=String({{Cookie - _ga}}||"").split(".");'
        'return a.length>3?a[2]+"."+a[3]:"n/a"}catch(b){return"n/a"}'))])
    for key in ("gclid", "gbraid", "wbraid"):
        b.variable("URL - " + key, "u", [tpl("component", "QUERY"), tpl("queryKey", key),
                                         boolean("enableMultiQueryKeys", False),
                                         boolean("enableIgnoreEmptyQueryParam", False)])
    b.variable("JS - Ad click id present", "jsm", [tpl("javascript", js(
        'return /[?&](gclid|gbraid|wbraid)=/.test(document.location.search)?"true":"false"'))])
    # The abandoned-form log reads the fields straight from the DOM: the site's
    # quote forms use placeholder "Enter your name", type=email and type=tel.
    for label, selector in (("name", "input[placeholder=\"Enter your name\"]"),
                            ("email", "input[type=\"email\"]"),
                            ("phone", "input[type=\"tel\"]")):
        b.variable("JS - Form field " + label, "jsm", [tpl("javascript", js(
            "var a=document.querySelector('" + selector + "');"
            'return a?a.value.toLowerCase():""'))])

    # ---- tags -----------------------------------------------------------
    b.tag("Google Tag - GA4", "googtag", [tpl("tagId", GA4_ID)], [ALL_PAGES])
    b.tag("Google Tag - Ads", "googtag", [tpl("tagId", "AW-" + ADS_ID)], [INITIALIZATION])
    b.tag("Ads - Conversion Linker", "gclidw",
          [boolean("enableCrossDomain", False), boolean("enableUrlPassthrough", False),
           boolean("enableCookieOverrides", False)], [ALL_PAGES])
    b.tag("Ads - Remarketing", "sp",
          [boolean("enableConversionLinker", True), tpl("conversionCookiePrefix", "_gcl"),
           tpl("conversionId", ADS_ID), tpl("customParamsFormat", "NONE"),
           boolean("enableDynamicRemarketing", False), boolean("rdp", False)], [INITIALIZATION])

    b.tag("Ads - Conversion - Lead", "awct",
          [boolean("enableConversionLinker", True), tpl("conversionCookiePrefix", "_gcl"),
           tpl("conversionId", ADS_ID), tpl("conversionLabel", ADS_LABEL),
           boolean("enableEnhancedConversion", True),
           tpl("cssProvidedEnhancedConversionValue", "{{UPD - Lead}}"),
           boolean("enableNewCustomerReporting", False), boolean("enableProductReporting", False),
           boolean("enableShippingData", False), boolean("rdp", False)], ["Lead - generate_lead"])
    b.tag("Ads - User-Provided Data", "awud",
          [tpl("userDataVariable", "{{UPD - Lead}}"), boolean("enableConversionLinker", True),
           tpl("conversionCookiePrefix", "_gcl"), tpl("conversionId", "{{Const - Ads Conversion ID}}")],
          ["Lead - generate_lead"])

    def ga4_event(name, event_name, triggers, params=(), user_data=False):
        p = [boolean("sendEcommerceData", False), tpl("eventName", event_name),
             tpl("measurementIdOverride", "{{Const - GA4 Measurement ID}}")]
        if params:
            p.append(event_params(params))
        if user_data:
            p.append(tpl("userDataVariable", "{{UPD - Lead}}"))
        b.tag(name, "gaawe", p, triggers)

    ga4_event("GA4 - Event - GTM - Send Form", "GTM - Send Form", ["Lead - generate_lead"],
              params=[("form_location", "{{DL - form_location}}"), ("city", "{{DL - city}}")],
              user_data=True)
    ga4_event("GA4 - Event - Phone Link Clicks", "Phone Link Clicks", ["Click - Phone link (tel:)"])
    ga4_event("GA4 - Event - Click Button - REQUEST A QUOTE", "Click Button - REQUEST A QUOTE",
              ["Click - Request a Quote"])
    ga4_event("GA4 - Event - GTM_View_Confirmation Page", "GTM_View_Confirmation Page",
              ["Page View - Thank you"], user_data=True)

    b.tag("Clarity", "html", html_tag(
        '<script>\n(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};'
        't=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=gtm";'
        'y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})'
        '(window,document,"clarity","script","' + CLARITY_PROJECT + '");\n</script>'), [ALL_PAGES])
    b.tag("CallRail - swap.js", "html", html_tag(
        '<script type="text/javascript" src="' + CALLRAIL_SWAP + '"></script>'), [ALL_PAGES])

    with open(SOURCEBUSTER, encoding="utf-8") as f:
        sourcebuster = f.read().strip()
    b.tag("sourcebuster", "html", html_tag(sourcebuster), ["DOM Ready - All Pages"])

    b.tag("Forms - abandoned form tracking", "html", html_tag(
        '<script>\n(function(){\n'
        '  document.addEventListener("input",function(e){'
        'var f=e.target&&e.target.closest?e.target.closest("form"):null;'
        'if(f)f.dataset.formInteracted="true"});\n'
        '  window.addEventListener("beforeunload",function(){'
        'document.querySelectorAll("form").forEach(function(form){'
        'if(form.dataset.formInteracted!=="true"||form.dataset.formSubmitted)return;'
        'var data={};form.querySelectorAll("input, textarea, select").forEach(function(el){'
        'if(el.type!=="hidden"&&el.value)data[el.name||el.id||el.className]=el.value});'
        'if(Object.keys(data).length){window.dataLayer=window.dataLayer||[];'
        'window.dataLayer.push({event:"abandoned_form",form_data:data})}})});\n'
        '})();\n</script>'), ["Window Loaded - All Pages"])

    b.tag("Sheet - Lead", "html", html_tag(
        '<script>\n(function(){\n'
        '  var name="{{DL - lead_name}}",email="{{DL - lead_email}}",phone="{{DL - lead_phone}}";\n'
        '  if(!name||!email||!phone)return;\n'
        '  var url="' + HOOK_LEAD + '";\n'
        '  var params="?Date="+encodeURIComponent("{{JS - Date formatted}}")'
        '+"&Name="+encodeURIComponent(name)'
        '+"&Email="+encodeURIComponent(email)'
        '+"&Phone="+encodeURIComponent(phone)'
        '+"&Source="+encodeURIComponent("{{JS - sbjs source}}")'
        '+"&Device="+encodeURIComponent("{{JS - Device}}")'
        '+"&City="+encodeURIComponent("{{DL - city}}")'
        '+"&Form="+encodeURIComponent("{{DL - form_location}}");\n'
        '  var img=new Image();img.src=url+params;\n'
        '})();\n</script>'), ["Lead - generate_lead"])

    visit = ("&Device={{JS - Device}}&OS={{JS - OS}}"
             "&GCLID={{URL - gclid}}&GBRAID={{URL - gbraid}}&WBRAID={{URL - wbraid}}"
             "&UTM-Source={{JS - sbjs source}}&UTM-Medium={{JS - sbjs medium}}"
             "&UTM-Campaign={{JS - sbjs campaign}}&UTM-Term={{JS - sbjs term}}"
             "&UTM-Content={{JS - sbjs content}}&Client-ID={{JS - GA Client ID}}")
    b.tag("Sheet - Phone click", "img",
          image_tag(HOOK_PHONE + "?Date={{JS - Date formatted}}" + visit),
          ["Click - Phone link (tel:) - Ad visit"])
    b.tag("Sheet - Abandoned form", "img",
          image_tag(HOOK_ABANDONED + "?Date={{JS - Date formatted}}"
                    "&Name={{JS - Form field name}}&Email={{JS - Form field email}}"
                    "&Phone={{JS - Form field phone}}" + visit),
          ["Custom Event - abandoned_form"])
    b.tag("Sheet - Page view", "img",
          image_tag(HOOK_PAGEVIEW + "?Date={{JS - Date formatted}}" + visit),
          ["Window Loaded - Ad visit"])

    builtins = [
        ("PAGE_URL", "Page URL"), ("PAGE_HOSTNAME", "Page Hostname"), ("PAGE_PATH", "Page Path"),
        ("REFERRER", "Referrer"), ("EVENT", "Event"), ("CLICK_ELEMENT", "Click Element"),
        ("CLICK_CLASSES", "Click Classes"), ("CLICK_ID", "Click ID"), ("CLICK_TARGET", "Click Target"),
        ("CLICK_URL", "Click URL"), ("CLICK_TEXT", "Click Text"), ("CONTAINER_ID", "Container ID"),
        ("RANDOM_NUMBER", "Random Number"),
    ]

    return {
        "exportFormatVersion": 2,
        "exportTime": "2026-09-15 12:00:00",
        "containerVersion": {
            "path": f"accounts/{ACCOUNT}/containers/{CONTAINER}/versions/0",
            "accountId": ACCOUNT,
            "containerId": CONTAINER,
            "containerVersionId": "0",
            "name": "thegoatmovers.net rebuilt",
            "container": {
                "path": f"accounts/{ACCOUNT}/containers/{CONTAINER}",
                "accountId": ACCOUNT,
                "containerId": CONTAINER,
                "name": "thegoatmovers.net",
                "publicId": "GTM-XXXXXXX",
                "usageContext": ["WEB"],
                "fingerprint": "0",
            },
            "tag": b.tags,
            "trigger": b.triggers,
            "variable": b.variables,
            "builtInVariable": [
                {"accountId": ACCOUNT, "containerId": CONTAINER, "type": t, "name": n}
                for t, n in builtins
            ],
            "fingerprint": "0",
        },
    }


if __name__ == "__main__":
    export = build()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(export, f, indent=2, ensure_ascii=False)
        f.write("\n")
    cv = export["containerVersion"]
    print(f"{OUT}: {len(cv['tag'])} tags, {len(cv['trigger'])} triggers,"
          f" {len(cv['variable'])} variables, {os.path.getsize(OUT)} bytes")
