import os
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder="frontend", static_url_path="")

GOOGLE_SHEETS_API_KEY = os.getenv("GOOGLE_SHEETS_API_KEY", "").strip()
SPREADSHEET_ID = os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID", "").strip()
SHEET_RANGE = os.getenv("GOOGLE_SHEETS_RANGE", "FormResponses!A2").strip()
SHEET_WEBHOOK_URL = os.getenv("GOOGLE_SHEETS_WEBHOOK_URL", "").strip()

COLUMNS = [
    "timestamp",
    "recordType",
    "campYear",
    "email",
    "firstName",
    "lastName",
    "phone",
    "under18",
    "preferredInstrument",
    "preferredGroup",
    "additionalInstrument1",
    "additionalInstrument1Group",
    "additionalInstrument2",
    "additionalInstrument2Group",
    "additionalInstrument3",
    "additionalInstrument3Group",
    "travelByBus",
    "bringCaravanTent",
    "specialNeeds",
    "activityInterest",
    "tutor",
    "playInAlbany",
    "concertoTitle",
    "concertoComposer",
    "chamberTitle",
    "chamberInstruments",
    "payingOwnFees",
    "payeeEmail",
    "offsitePrice",
    "parentContactName",
    "parentContactEmail",
    "parentAttending",
    "guardianName",
    "guardianEmail",
    "guardianOver25",
    "guardianRoomAcknowledged",
    "guardianDeclaration",
    "parentDeclaration",
    "partialAttendance",
    "additionalInfo",
    "childIndex",
    "childEmail",
    "childFirstName",
    "childLastName",
    "childDOB",
    "childInstrument",
    "childAdditional",
    "childSpecialNeeds",
    "childActivities",
    "childExtraInfo",
]


def safe_str(value):
    if value is None:
        return ""
    return str(value)


def build_main_row(form):
    return [
        datetime.utcnow().isoformat(),
        "main",
        "2026",
        safe_str(form.get("email", "")),
        safe_str(form.get("firstName", "")),
        safe_str(form.get("lastName", "")),
        safe_str(form.get("phone", "")),
        safe_str(form.get("under18", "")),
        safe_str(form.get("preferredInstrument", "")),
        safe_str(form.get("preferredGroup", "")),
        safe_str(form.get("additionalInstrument1", "")),
        safe_str(form.get("additionalInstrument1Group", "")),
        safe_str(form.get("additionalInstrument2", "")),
        safe_str(form.get("additionalInstrument2Group", "")),
        safe_str(form.get("additionalInstrument3", "")),
        safe_str(form.get("additionalInstrument3Group", "")),
        safe_str(form.get("travelByBus", "")),
        safe_str(form.get("bringCaravanTent", "")),
        safe_str(form.get("specialNeeds", "")),
        safe_str(form.get("activityInterest", "")),
        safe_str(form.get("tutor", "")),
        safe_str(form.get("playInAlbany", "")),
        safe_str(form.get("concertoTitle", "")),
        safe_str(form.get("concertoComposer", "")),
        safe_str(form.get("chamberTitle", "")),
        safe_str(form.get("chamberInstruments", "")),
        safe_str(form.get("payingOwnFees", "")),
        safe_str(form.get("payeeEmail", "")),
        safe_str(form.get("offsitePrice", "")),
        safe_str(form.get("parentContactName", "")),
        safe_str(form.get("parentContactEmail", "")),
        safe_str(form.get("parentAttending", "")),
        safe_str(form.get("guardianName", "")),
        safe_str(form.get("guardianEmail", "")),
        safe_str(form.get("guardianOver25", "")),
        safe_str(form.get("guardianRoomAcknowledged", "")),
        safe_str(form.get("guardianDeclaration", "")),
        safe_str(form.get("parentDeclaration", "")),
        safe_str(form.get("partialAttendance", "")),
        safe_str(form.get("additionalInfo", "")),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
    ]


def build_child_row(parent, child, index):
    return [
        datetime.utcnow().isoformat(),
        "child",
        "2026",
        safe_str(parent.get("email", "")),
        safe_str(parent.get("firstName", "")),
        safe_str(parent.get("lastName", "")),
        safe_str(parent.get("phone", "")),
        safe_str(child.get("under18", "")),
        safe_str(child.get("preferredInstrument", "")),
        safe_str(child.get("preferredGroup", "")),
        safe_str(child.get("additionalInstrument1", "")),
        safe_str(child.get("additionalInstrument1Group", "")),
        safe_str(child.get("additionalInstrument2", "")),
        safe_str(child.get("additionalInstrument2Group", "")),
        safe_str(child.get("additionalInstrument3", "")),
        safe_str(child.get("additionalInstrument3Group", "")),
        safe_str(child.get("travelByBus", "")),
        safe_str(child.get("bringCaravanTent", "")),
        safe_str(child.get("specialNeeds", "")),
        safe_str(child.get("activityInterest", "")),
        safe_str(child.get("tutor", "")),
        safe_str(child.get("playInAlbany", "")),
        safe_str(child.get("concertoTitle", "")),
        safe_str(child.get("concertoComposer", "")),
        safe_str(child.get("chamberTitle", "")),
        safe_str(child.get("chamberInstruments", "")),
        safe_str(parent.get("payingOwnFees", "")),
        safe_str(parent.get("payeeEmail", "")),
        safe_str(parent.get("offsitePrice", "")),
        safe_str(child.get("parentContactName", "")),
        safe_str(child.get("parentContactEmail", "")),
        safe_str(child.get("parentAttending", "")),
        safe_str(child.get("guardianName", "")),
        safe_str(child.get("guardianEmail", "")),
        safe_str(child.get("guardianOver25", "")),
        safe_str(child.get("guardianRoomAcknowledged", "")),
        safe_str(child.get("guardianDeclaration", "")),
        safe_str(child.get("parentDeclaration", "")),
        safe_str(parent.get("partialAttendance", "")),
        safe_str(parent.get("additionalInfo", "")),
        str(index + 1),
        safe_str(child.get("email", "")),
        safe_str(child.get("firstName", "")),
        safe_str(child.get("lastName", "")),
        safe_str(child.get("dob", "")),
        safe_str(child.get("preferredInstrument", "")),
        safe_str("Additional instruments: " + ", ".join(filter(None, [child.get("additionalInstrument1", ""), child.get("additionalInstrument2", ""), child.get("additionalInstrument3", "")]))) if child.get("additionalInstrument1") or child.get("additionalInstrument2") or child.get("additionalInstrument3") else "",
        safe_str(child.get("specialNeeds", "")),
        safe_str(child.get("activityInterest", "")),
        safe_str(child.get("additionalInfo", "")),
    ]


def build_rows(form):
    rows = [build_main_row(form)]
    children = form.get("children", []) or []
    for idx, child in enumerate(children):
        if (
            child.get("firstName")
            or child.get("lastName")
            or child.get("email")
            or child.get("preferredInstrument")
            or child.get("instrument")
        ):
            rows.append(build_child_row(form, child, idx))
    return rows


def append_rows(rows):
    if SHEET_WEBHOOK_URL:
        response = requests.post(SHEET_WEBHOOK_URL, json={"rows": rows}, timeout=15)
        response.raise_for_status()
        return response.json()

    if not GOOGLE_SHEETS_API_KEY or not SPREADSHEET_ID:
        raise ValueError("GOOGLE_SHEETS_API_KEY and GOOGLE_SHEETS_SPREADSHEET_ID must be set.")

    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{SHEET_RANGE}:append"
    params = {"valueInputOption": "RAW", "key": GOOGLE_SHEETS_API_KEY}
    payload = {"values": rows}
    response = requests.post(url, params=params, json=payload, timeout=15)
    response.raise_for_status()
    return response.json()


@app.route("/submit", methods=["POST"])
def submit():
    payload = request.get_json(force=True)
    if not payload:
        return jsonify({"success": False, "error": "Missing JSON body."}), 400

    required_fields = ["email", "firstName", "lastName", "phone", "payingOwnFees", "declarationAccepted"]
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return jsonify({"success": False, "error": f"Missing required fields: {', '.join(missing)}"}), 400

    if payload.get("payingOwnFees") == "No" and not payload.get("payeeEmail"):
        return jsonify({"success": False, "error": "Missing required field: payeeEmail"}), 400

    rows = build_rows(payload)
    try:
        result = append_rows(rows)
    except Exception as exc:
        return jsonify({"success": False, "error": f"Unable to append rows: {exc}"}), 500

    return jsonify({"success": True, "result": result}), 200


@app.route("/", defaults={"path": "index.html"})
@app.route("/<path:path>")
def public_file(path):
    static_path = os.path.join(app.static_folder, path)
    if os.path.exists(static_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 8080)))
