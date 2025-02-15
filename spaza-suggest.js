import ShortUniqueId from "short-unique-id";

export default function SpazaSuggest(db) {
  const uid = new ShortUniqueId({ length: 5 });

  //// returns client code
  async function registerClient(username) {
    try {
      const uniqCode = uid();
      await db.none(
        `insert into spaza_client (username, code) values ($1, $2)`,
        [username,uniqCode]
      );
      console.log("username")
      
      return uniqCode;
    } catch (error) {
      console.error("Error registering client:", error.message);
      throw error; // Rethrow the error to handle it in the route handler
    }
  }

  // returns the user if it's a valid code
  async function clientLogin(code) {
    const client = await db.oneOrNone(
      `select * from spaza_client where code = $1`,
      [code]
    );
    return client;
  }

  // return all areas
  async function areas() {
    const areas = await db.manyOrNone(
      `select * from area order by area_name asc`
    );
    return areas;
  }

  async function findAreaByName(name) {
    const area = await db.oneOrNone(`select * from area where area_name = $1`, [
      name,
    ]);
    return area;
  }

  async function suggestProduct(areaId, clientId, suggestion) {
    await db.none(
      `insert into suggestion(area_id, client_id, product_name) values ($1, $2, $3)`,
      [areaId, clientId, suggestion]
    );
  }

  // Show all the suggestions for a given area
  async function suggestionsForArea(areaId) {
    const suggestions = await db.manyOrNone(
      `SELECT * FROM suggestion WHERE area_id = $1`,
      [areaId]
    );
    return suggestions;
  }

  // show all the suggestions made by a user
  // TODO - review this... do we want this for a region...?
  async function suggestions(clientId) {
    return await db.manyOrNone(
      `select * from suggestion join area on suggestion.area_id = area.id where client_id = $1`,
      [clientId]
    );
  }

  // upvote a given suggestion
  async function likeSuggestion(suggestionId, userId) {
    await db.none(
      `insert into liked_suggestion (suggestion_id, user_id) values ($1, $2)`,
      [suggestionId, userId]
    );
  }

  // create the spaza shop and return a code
  async function registerSpaza(name, areaId) {
    const uniqCode = uid();
    await db.none(
      `insert into spaza (shop_name, area_id, code) values ($1, $2, $3)`,
      [name, areaId, uniqCode]
    );
    return uniqCode;
  }

  // return the spaza name & id  and areaId for the spaza shop
  async function spazaLogin(code) {
    const spaza = await db.oneOrNone(`select * from spaza where code = $1`, [
      code,
    ]);
    return spaza;
  }

  async function alreadyAcceptedSuggestionForSpaza(suggestionId, spazaId) {
    // Check if a suggestion is already accepted by a Spaza shop
    const count = await db.oneOrNone(
      `select count(*) from accepted_suggestion where suggestion_id = $1 and spaza_id = $2`,
      [suggestionId, spazaId],
      (row) => row.count
    );
    return count === 1;
  }
  async function acceptSuggestion(suggestionId, spazaId) {
    if (!(await alreadyAcceptedSuggestionForSpaza(suggestionId, spazaId))) {
      await db.none(
        `insert into accepted_suggestion(suggestion_id, spaza_id) values ($1, $2)`,
        [suggestionId, spazaId]
      );
    }
  }

  // return all the accepted suggestions for the spazaId provided
  async function acceptedSuggestions(spazaId) {
    const suggesstions = await db.manyOrNone(
      `
            select * from suggestion join accepted_suggestion 
            on suggestion.id = accepted_suggestion.suggestion_id 
            where accepted_suggestion.spaza_id = $1`,
      [spazaId]
    );

    // console.log(suggesstions);

    return suggesstions;
  }

  return {
    acceptSuggestion,
    acceptedSuggestions,
    areas,
    findAreaByName,
    registerSpaza,
    registerClient,
    spazaLogin,
    suggestProduct,
    suggestions,
    suggestionsForArea,
    likeSuggestion,
    clientLogin,
  };
}
