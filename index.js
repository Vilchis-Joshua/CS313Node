var express = require('express');
var app = express();
var url = require('url');

app.set('port', (process.env.PORT || 5000));
const connectionString = 'postgres://postgres:hello@localhost:5433/NodeProject';
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {

})


//======================================  Week09   ===================================
app.get('/getRate', (req, res) => {
    calculateRate(req, res);
}
);

function calculateRate(req, res) {
    var path = url.parse(req.url, true);

    var lt = path.query.lettertype;
    lt = lt.toLowerCase();

    var result = 0;
    var weight = path.query.weight;

    if (lt === 'stamped') {
        //console.log(opOne + opTwo);
        if (Number(weight) <= 1 && Number(weight) > 0) {
            result += 0.50;
        } else if (Number(weight) <= 2 && Number(weight) > 1) {
            result += 0.71;
        } else if (Number(weight) <= 3 && Number(weight) > 2) {
            result += 0.92;
        } else {
            result += 1.13;
        }
    } else if (lt === 'metered') {
        //console.log(opOne - opTwo);
        if (Number(weight) <= 1 && Number(weight) > 0) {
            result += 0.47;
        } else if (Number(weight) <= 2 && Number(weight) > 1) {
            result += 0.68;
        } else if (Number(weight) <= 3 && Number(weight) > 2) {
            result += 0.89;
        } else {
            result += 1.10;
        }
    } else if (lt === 'flats') {
        //console.log(opOne * opTwo);
        if (Number(weight) <= 1 && Number(weight) > 0) {
            result += 1.00;
        } else if (Number(weight) <= 2 && Number(weight) > 1) {
            result += 1.21;
        } else if (Number(weight) <= 3 && Number(weight) > 2) {
            result += 1.42;
        } else if (Number(weight) <= 4 && Number(weight) > 3) {
            result += 1.63;
        } else if (Number(weight) <= 5 && Number(weight) > 4) {
            result += 1.84;
        } else if (Number(weight) <= 6 && Number(weight) > 5) {
            result += 2.05;
        } else if (Number(weight) <= 7 && Number(weight) > 6) {
            result += 2.26;
        } else if (Number(weight) <= 8 && Number(weight) > 7) {
            result += 2.47;
        } else if (Number(weight) <= 9 && Number(weight) > 8) {
            result += 2.68;
        } else if (Number(weight) <= 10 && Number(weight) > 9) {
            result += 2.89;
        } else if (Number(weight) <= 11 && Number(weight) > 10) {
            result += 3.10;
        } else if (Number(weight) <= 12 && Number(weight) > 11) {
            result += 3.31;
        } else {
            result += 3.52;
        }
    } else {
        //console.log(opOne / opTwo);
        if (Number(weight) <= 1 && Number(weight) > 0) {
            result += 3.50;
        } else if (Number(weight) <= 2 && Number(weight) > 1) {
            result += 3.50;
        } else if (Number(weight) <= 3 && Number(weight) > 2) {
            result += 3.50;
        } else if (Number(weight) <= 4 && Number(weight) > 3) {
            result += 3.50;
        } else if (Number(weight) <= 5 && Number(weight) > 4) {
            result += 3.75;
        } else if (Number(weight) <= 6 && Number(weight) > 5) {
            result += 3.75;
        } else if (Number(weight) <= 7 && Number(weight) > 6) {
            result += 3.75;
        } else if (Number(weight) <= 8 && Number(weight) > 7) {
            result += 3.75;
        } else if (Number(weight) <= 9 && Number(weight) > 8) {
            result += 4.10;
        } else if (Number(weight) <= 10 && Number(weight) > 9) {
            result += 4.45;
        } else if (Number(weight) <= 11 && Number(weight) > 10) {
            result += 4.80;
        } else if (Number(weight) <= 12 && Number(weight) > 11) {
            result += 5.15;
        } else {
            result += 5.50;
        }
    }

    var d = { lettertype: lt, weight: weight, result: result };
    res.render('pages/results', d);
}



//======================================  Week10 Prove  ===================================
var pg, Pool = require('pg');

app.get('/getPerson', (req, res) => {
    accessDb(req, res);
})


//const pool = new Pool()
//const DATABASE_URL = process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/NodeProject';
//console.log(DATABASE_URL);

//// you can also use async/await
//const res = await pool.query('SELECT NOW()')
//await pool.end()

//// clients will also use environment variables
//// for connection information
//const client = new Client()
//await client.connect()

//const res = await client.query('SELECT NOW()')
//await client.end()

function accessDb(req, res) {
    //var path = url.parse(req.url, true);
    //var db_url = url.parse(process.env.DATABSE_URL);

    //pool.query('SELECT NOW()', (err, res) => {
    //    console.log(err, res);
    //    pool.end();
    //})

    //var id = Number(req.query.id);
    var id = req.query.id;

    console.log('id: ' + id);
    getPerson(id, function (error, result) {
        if (error || result == null || result.length != 1) {
            res.status(500).json({ success: false, data: error });
        } else {
            var person = result[0];
            res.status(200).json(person);
        }
    })

}


function getPerson(id, callback) {
    console.log('Getting person from DB with id: ' + id);
    var client = new pg.Client(connectionString);

    client.connect(function (err) {
        if (err) {
            console.log('Error connecting to DB: ');
            console.log('err');
            callback(err, null);
        }

        var sql = 'SELECT id, first_name, last_name, birthdate FROM person WHERE id = $1::int';
        var params = [id];

        var query = client.query(sql, params, function (err, result) {
            client.end(function (err) {
                if (err) throw err;
            });
            if (err) {
                console.log('Error in query: ')
                console.log(err);
                callback(err, null);
            }

            console.log('Found result: ' + JSON.stringify(result.rows));

            callback(null, result.rows);
        })
    })
}

//var client = new Client({
//    connectionString: DATABASE_URL,
//    ssl: true,
//});

//client.connect();

//client.query('SELECT * FROM users;', (err, res) => {
//    if (err) throw err;
//    for (let row of res.rows) {
//        console.log(JSON.stringify(row));
//    }
//    client.end();
//});




//var Pool = require('pg');
app.get('/accessDb', (req, res) => {
    access(req, res);
}
);


function access(req, res) {
    //const pool = new Pool({
    //    user: 'yqhzwrvewemaud',
    //    host: 'ec2-23-23-222-184.compute-1.amazonaws.com',
    //    database: 'd1vksbuq5c3urg',
    //    password: '2c046eea10447074a808324cdff0754c64cfc5c5028f2fb94d3acc84912ed0fe',
    //    port: 5432
    //})

    //pg.connect(process.env.DATABSE_URL, function (err, client, done) {
    //    client.query('SELECT now()', function (err, result) {
    //        done();
    //        if (err) return console.error(err);
    //        console.log(result.rows);
    //    })
    //})

    var connectionString2 = 'postgres://yqhzwrvewemaud:2c046eea10447074a808324cdff0754c64cfc5c5028f2fb94d3acc84912ed0fe@ec2-23-23-222-184.compute-1.amazonaws.com:5432/d1vksbuq5c3urg';
    const pool = new Pool({
        connectionString: connectionString2,
    });

    pool.query('SELECT now()', (err, res) => {
        console.log(err, res);
        pool.end();
    })

}

app.listen(app.get('port'), () => console.log('listening to: ' + app.get('port')));

// To parse a heroku-node-js connection string https://github.com/iceddev/pg-connection-string
// NASA api ssJOmcyAlMslRMBklollwmpbUSmejdcgJlsemAzo