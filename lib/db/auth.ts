let _uid: number | null = null;

// set the user id from login once it is done
export function setCurrentUserId(id: number) {
  _uid = id; 
}

// returns user id, function can be used anywhere
export function getCurrentUserId(): number {
  if (_uid == null) throw new Error("Not logged in");
  return _uid;
}

