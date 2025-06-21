export default function handler(req, res) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    res.status(200).json({ status: 'ok', project_id: serviceAccount.project_id });
  } catch (e) {
    res.status(500).json({ error: 'FIREBASE_SERVICE_ACCOUNT_KEY not working', details: e.message });
  }
}
