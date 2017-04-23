<?php

namespace Dijkstra\V1\Connection;


interface IConnection
{
    /**
     * @return mixed
     */
    public function connect();

    /**
     * @param $sql
     * @return mixed
     */
    public function fetchAll($sql);

    /**
     * @return mixed
     */
    public function close();
}