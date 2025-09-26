export const parseAuthHeader = (headers: unknown) => {
  if (!headers || typeof headers !== "object") {
    return null;
  }

  const h = headers as Record<string, unknown>;

  const accessToken = h["access-token"];
  const client = h["client"];
  const uid = h["uid"];
  const tokenType = h["token-type"];
  const expiry = h["expiry"];

  // 型ガード
  if (
    typeof accessToken === "string" &&
    typeof client === "string" &&
    typeof uid === "string" &&
    typeof tokenType === "string" &&
    typeof expiry === "string"
  ) {
    return {
      "access-token": accessToken,
      client,
      uid,
      "token-type": tokenType,
      expiry,
    };
  }

  return null;
};
