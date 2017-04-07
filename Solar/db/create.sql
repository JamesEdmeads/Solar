DROP TABLE IF EXISTS system;
DROP TABLE IF EXISTS planet;

CREATE TABLE system (
  id INTEGER /*PRIMARY KEY AUTOINCREMENT*/
);

CREATE TABLE planet (
  id INTEGER /*PRIMARY KEY AUTOINCREMENT*/,
  distance float,
  p_size float,
  speed float,
  colour varchar(10),
  sys_id int,
  FOREIGN KEY (sys_id) REFERENCES system(id)
);
