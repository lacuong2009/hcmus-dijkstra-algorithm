<?php
/**
 * Created by PhpStorm.
 * User: AnhCuong
 * Date: 05-Apr-17
 * Time: 10:03 PM
 */

namespace Dijkstra\V1\Connection;


class PostgresqlConnection implements IConnection
{
    /**
     * @var string
     */
    private $host = 'localhost';

    /**
     * @var string
     */
    private $username = 'root';

    /**
     * @var string
     */
    private $password = '';

    /**
     * @var null|string
     */
    private $database = '';

    /**
     * @var int
     */
    private $port = 5432;

    /**
     * @var string
     */
    private $charset = 'utf8';

    /**
     * @var \mysqli
     */
    private $connection;

    /**
     * Connection constructor.
     * @param null $host
     * @param null $username
     * @param null $password
     * @param null $database
     * @param int $port
     * @param string $charset
     */
    public function __construct($host = null, $username = null, $password = null, $database = null, $port = 5432, $charset = 'utf8')
    {
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->database = $database;
        $this->port = $port;
        $this->charset = $charset;

        $this->connect();
    }

    public function connect()
    {
        $this->connection = pg_connect("host=$this->host port=$this->port dbname=$this->database user=$this->username password=$this->password");

        if(! $this->connection){
            die("Error : Unable to open database\n");
        }
        pg_set_client_encoding($this->connection , "UNICODE");

        return $this->connection;
    }

    public function fetchAll($sql)
    {
        $results = [];
        $ret = pg_query($this->connection, $sql);
        if(!$ret){
            die(pg_last_error($this->connection));
        }

        while($row = pg_fetch_assoc($ret)){
            $results[] = $row;
        }

        return $results;
    }

    public function close()
    {
        pg_close($this->close());
    }
}