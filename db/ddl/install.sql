DROP TABLE item IF EXISTS ;
CREATE CACHED TABLE item(
    id IDENTITY,
    content VARCHAR(4096),
    estimation INT DEFAULT NULL,
    sprintid INTEGER DEFAULT NULL,
    offsetx DECIMAL DEFAULT 0,
    offsety DECIMAL DEFAULT 0,
    col INTEGER DEFAULT 0,
    owner VARCHAR(25) DEFAULT NULL,
    color VARCHAR(10) NOT NULL,
    hoursleft INTEGER DEFAULT NULL,
    height INTEGER NOT NULL,
    width INTEGER NOT NULL
);

DROP TABLE col IF EXISTS ;
CREATE CACHED TABLE col(
    id IDENTITY,
    name VARCHAR(100) NOT NULL,
    columntype VARCHAR(20) DEFAULT NULL,
    columnorder INTEGER NOT NULL,
    width DECIMAL DEFAULT NULL
);

INSERT INTO col(name, columntype, columnorder, width)
    VALUES('Not Started', 'NOT_STARTED', 0, 50);

INSERT INTO col(name, columntype, columnorder, width)
    VALUES('DONE', 'DONE', 1000000, 50);

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