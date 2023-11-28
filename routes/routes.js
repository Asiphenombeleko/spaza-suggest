export default function spazaroutes(spaza){
    async function register(req, res){
        const  username = req.body?.username || '';
        console.log("username"+"***")
        const loginCode = spaza.registerClient(username);
        res.render("index",{

        });
      }
      async function login(req, res){
        const { code } = req.body;
        const clientInfo = spaza.clientLogin(code);
        if (clientInfo) {
          req.session.client = clientInfo; // Store client details in the session
          res.render("login");
        } else {
          res.status(401).json({ error: 'Invalid login code' });
        }
      }
     async function suggest(req, res) {
        const { areaId, suggestion } = req.body;
        const clientId = req.session.client.id; // Retrieve client ID from the session
        spaza.suggestProduct(areaId, clientId, suggestion);
        res.json({ success: true });
      }
    async function clientSuggestion(req, res) {
        const clientId = req.session.client.id; // Retrieve client ID from the session
        const clientSuggestions = spaza.suggestions(clientId);
        res.json(clientSuggestions);
      }
      async function spazaRegister(req, res) {
        const { name, areaId } = req.body;
        const loginCode = spaza.registerSpaza(name, areaId);
        res.json({ loginCode });
      }
      async function spazaLogin(req, res) {
        const { code } = req.body;
        const spazaInfo = spaza.spazaLogin(code);
        if (spazaInfo) {
          req.session.shop = spazaInfo; // Store spaza shop details in the session
          res.json(spazaInfo);
        } else {
          res.status(401).json({ error: 'Invalid login code' });
        }
      }
      async function shopSuggestions(req, res){
        const areaId = req.session.shop.area_id; // Retrieve area ID from the session
        const shopSuggestions = spaza.suggestionsForArea(areaId);
        res.json(shopSuggestions);
      }
     async function acceptSuggestions(req, res){
        const { suggestionId } = req.body;
        const spazaId = req.session.shop.id; // Retrieve spaza ID from the session
        spaza.acceptSuggestion(suggestionId, spazaId);
        res.json({ success: true });
      }
      async function acceptedSuggestions(req, res) {
        const spazaId = req.session.shop.id; // Retrieve spaza ID from the session
        const acceptedSuggestions = spaza.acceptedSuggestions(spazaId);
        res.json(acceptedSuggestions);
      }
      return {
        register,
        login,
        suggest,
        clientSuggestion,
        spazaRegister,
        spazaLogin,
        shopSuggestions,
        acceptSuggestions,
        acceptedSuggestions
      }
}