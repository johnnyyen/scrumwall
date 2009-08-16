DROP TABLE IF EXISTS item;
CREATE CACHED TABLE item(
    id IDENTITY,
    content VARCHAR,
    estimation INT DEFAULT NULL,
    sprintid INTEGER DEFAULT NULL,
    offsetx DECIMAL,
    offsety DECIMAL,
    col INTEGER DEFAULT 1,
    owner VARCHAR DEFAULT NULL,
    color VARCHAR NOT NULL
);

DROP TABLE IF EXISTS col;
CREATE CACHED TABLE col(
    id IDENTITY,
    name VARCHAR NOT NULL,
    columntype VARCHAR DEFAULT NULL,
    columnorder INTEGER NOT NULL
);

INSERT INTO col(name, columntype, columnorder)
    VALUES('Not Started', 'NOT_STARTED', 0);

INSERT INTO col(name, columntype, columnorder)
    VALUES('DONE', 'DONE', 1000000);

INSERT INTO col(id, name, columntype, columnorder)
    VALUES(-2, 'GOALS', 'GOALS', 0);
    
INSERT INTO col(id, name, columntype, columnorder)
    VALUES(-1, 'UCB', 'UCB', 0);
    
INSERT INTO col(id, name, columntype, columnorder)
    VALUES(-3, 'IMPEDIMENTS', 'IMPEDIMENTS', 0);
    
ALTER TABLE item 
    ADD CONSTRAINT ItemToColumn FOREIGN KEY (col)
    REFERENCES col(id)
    ON DELETE SET DEFAULT;
    