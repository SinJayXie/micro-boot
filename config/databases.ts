interface MySqlConfig {
    host: string,
    user: string,
    password: string,
    database: string
}

const config: MySqlConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: ""
};

export = config;
