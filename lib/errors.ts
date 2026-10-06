import type { Lang } from "./i18n";

export const ERROR_TEXT: Record<Lang, Record<string, string>> = {
  ru: {
    "body must be an object": "Некорректный запрос",
    "body must be JSON": "Некорректный запрос",
    "start/end must be ISO8601 datetimes": "Неверная дата или время поездки",
    "end must be after start": "Окончание должно быть позже начала",
    "amount must be > 0": "Укажите сумму больше нуля",
    "payment must be cash or card": "Выберите способ оплаты",
    "commission must be >= 0": "Комиссия не может быть отрицательной",
    "id must be a string": "Id поездки должен быть текстом",
    "date query param required, YYYY-MM-DD": "Некорректная дата",
    "from/to query params required, YYYY-MM-DD": "Некорректный диапазон дат",
  },
  en: {
    "body must be an object": "Invalid request",
    "body must be JSON": "Invalid request",
    "start/end must be ISO8601 datetimes": "Invalid trip date or time",
    "end must be after start": "End must be later than start",
    "amount must be > 0": "Amount must be greater than zero",
    "payment must be cash or card": "Pick a payment method",
    "commission must be >= 0": "Commission cannot be negative",
    "id must be a string": "Trip id must be text",
    "date query param required, YYYY-MM-DD": "Invalid date",
    "from/to query params required, YYYY-MM-DD": "Invalid date range",
  },
  kk: {
    "body must be an object": "Қате сұрау",
    "body must be JSON": "Қате сұрау",
    "start/end must be ISO8601 datetimes": "Сапар күні немесе уақыты қате",
    "end must be after start": "Аяқталуы басылуынан кейін болуы керек",
    "amount must be > 0": "Нөлден үлкен соманы көрсетіңіз",
    "payment must be cash or card": "Төлем тәсілін таңдаңыз",
    "commission must be >= 0": "Қызмет ақысы теріс болмайды",
    "id must be a string": "Сапар id мәтін болуы керек",
    "date query param required, YYYY-MM-DD": "Күн қате",
    "from/to query params required, YYYY-MM-DD": "Күн аралығы қате",
  },
};

export function errorText(raw: unknown, lang: Lang): string {
  const key = typeof raw === "string" ? raw : "";
  return ERROR_TEXT[lang][key] ?? key ?? "error";
}