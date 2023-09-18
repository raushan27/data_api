const db = require("./db");

exports.create = (req, res) => {
  let tableName = req.params.collection;
  let keys = Object.keys(req.body).join(", ");
  let values = Object.values(req.body);
  let placeholders = values.map(() => "?").join(", ");

  // Check if id is present in the body
  if (req.body.id) {
    let checkSql = `SELECT * FROM ${tableName} WHERE id = ?`;
    db.query(checkSql, req.body.id, (err, result) => {
      if (err) throw err;
      // If id already exists in the database
      if (result.length > 0) {
        res.status(400).send({ msg: "Record already present" });
      } else {
        let sql = `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders})`;
        db.query(sql, values, (err, result) => {
          if (err) throw err;
          res.send(result);
        });
      }
    });
  } else {
    let sql = `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders})`;
    db.query(sql, values, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  }
};

exports.read = (req, res) => {
  let tableName = req.params.collection;
  let id = req.params.id;

  // Check if id is present in the database
  let checkSql = `SELECT * FROM ${tableName} WHERE id = ?`;
  db.query(checkSql, id, (err, result) => {
    if (err) throw err;
    // If id does not exist in the database
    if (result.length === 0) {
      res.status(400).send({ msg: "Record not found" });
    } else {
      res.send(result);
    }
  });
};

exports.all = (req, res) => {
  let tableName = req.params.collection;

  let sql = `SELECT * FROM ${tableName}`;
  db.query(sql, (err, result) => {
    if (err) {
      if (err.code === "ER_NO_SUCH_TABLE") {
        res.status(404).send({ msg: "Collection not found" });
      } else {
        throw err;
      }
    } else {
      res.send(result);
    }
  });
};

exports.update = (req, res) => {
  let tableName = req.params.collection;
  let id = req.params.id;
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);

  // Check if id is present in the database
  let checkSql = `SELECT * FROM ${tableName} WHERE id = ?`;
  db.query(checkSql, id, (err, result) => {
    if (err) throw err;
    // If id does not exist in the database
    if (result.length === 0) {
      res.status(400).send({ msg: "Record not found" });
    } else {
      // Check if id is present in the request body
      if (req.body.id) {
        db.query(checkSql, req.body.id, (err, result) => {
          if (err) throw err;
          // If id already exists in the database
          if (result.length > 0) {
            res.status(400).send({ msg: "Id already exists" });
          } else {
            let sql = `UPDATE ${tableName} SET ${keys
              .map((key) => `${key} = ?`)
              .join(", ")} WHERE id = ?`;
            db.query(sql, [...values, id], (err, result) => {
              if (err) throw err;
              res.send(result);
            });
          }
        });
      } else {
        let sql = `UPDATE ${tableName} SET ${keys
          .map((key) => `${key} = ?`)
          .join(", ")} WHERE id = ?`;
        db.query(sql, [...values, id], (err, result) => {
          if (err) throw err;
          res.send(result);
        });
      }
    }
  });
};

exports.delete = (req, res) => {
  let tableName = req.params.collection;
  let id = req.params.id;

  // Check if id is present in the database
  let checkSql = `SELECT * FROM ${tableName} WHERE id = ?`;
  db.query(checkSql, id, (err, result) => {
    if (err) throw err;
    // If id does not exist in the database
    if (result.length === 0) {
      res.status(400).send({ msg: "Record not found" });
    } else {
      let sql = `DELETE FROM ${tableName} WHERE id = ?`;
      db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    }
  });
};
