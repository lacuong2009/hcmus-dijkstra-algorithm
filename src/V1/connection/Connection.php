<?php
namespace Dijkstra\V1\Connection;

class Connection implements IConnection
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
    private $port = 3306;

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
    public function __construct($host = null, $username = null, $password = null, $database = null, $port = 3306, $charset = 'utf8')
    {
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->database = $database;
        $this->port = $port;
        $this->charset = $charset;

        $this->connect();
    }

    /**
     * init connection
     */
    public function connect()
    {
        $this->connection = mysqli_connect($this->host, $this->username, $this->password, $this->database, $this->port);

        // Check connection
        if (!$this->connection) {
            die("Connection failed: " . mysqli_connect_error());
        }

        mysqli_set_charset( $this->connection,  $this->charset);

        return $this->connection;
    }

    /**
     * @param $sql
     * @return array
     */
    public function fetchAll($sql)
    {
        $results = [];
        $result = $this->connection->query($sql);
        if ($result->num_rows > 0) {
            // output data of each row
            while($row = $result->fetch_assoc()) {
                $results[] = $row;
            }
        }

        return $results;
    }

    /**
     * close connection
     */
    public function close()
    {
        $this->connection->close();
    }

    /**
     * @return \mysqli
     */
    public function getConnection()
    {
        return $this->connection;
    }

    /**
     * @param \mysqli $connection
     */
    public function setConnection($connection)
    {
        $this->connection = $connection;
    }
}