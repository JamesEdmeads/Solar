DROP TABLE IF EXISTS system;
DROP TABLE IF EXISTS planet;

CREATE TABLE system (
  id INTEGER PRIMARY KEY
);

CREATE TABLE planet (
  -- by cnt++
  id INTEGER PRIMARY KEY,
  distance float NOT NULL,
  p_size float NOT NULL,
  speed float NOT NULL,
  colour varchar(10) NOT NULL,
  sys_id int NOT NULL,
  CONSTRAINT planet_err
  FOREIGN KEY (sys_id) REFERENCES system(id)
);
