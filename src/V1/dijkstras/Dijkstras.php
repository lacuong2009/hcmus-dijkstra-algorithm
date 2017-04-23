<?php
include __DIR__ . '/PriorityQueue.php';

class Graph
{
    private $verticies;

    function __construct()
    {
        $this->verticies = array();
    }

    public function add_vertex( $name, $edges )
    {
        $this->verticies[ $name ] = $edges;
    }

    public function shortest_path( $start, $finish )
    {
        $distances = array();
        $previous = array();
        $nodes = new PriorityQueue();

        foreach ( $this->verticies AS $vertex => $value )
        {
            if ( $vertex === $start )
            {
                $distances[ $vertex ] = 0;
                $nodes->insert( $vertex, 0 );
            }
            else
            {
                $distances[ $vertex ] = PHP_INT_MAX;
                $nodes->insert( $vertex, PHP_INT_MAX );
            }
            $previous[ $vertex ] = null;
        }

        $nodes->top();

        while ( $nodes->valid() )
        {
            $smallest = $nodes->current();
            if ( $smallest === $finish )
            {
                $path = array();
                while ( $previous[ $smallest ] )
                {
                    $path[] = $smallest;
                    $smallest = $previous[ $smallest ];
                }
                $path[] = $start;
                return array_reverse( $path );
            }

            if ( $smallest === null || $distances[ $smallest ] === PHP_INT_MAX )
            {
                break;
            }

            foreach ( $this->verticies[ $smallest ] AS $neighbor => $value )
            {
                $alt = $distances[ $smallest ] + $this->verticies[ $smallest ][ $neighbor ];
                if ( $alt < $distances[ $neighbor ] )
                {
                    $distances[ $neighbor ] = $alt;
                    $previous[ $neighbor ] = $smallest;
                    $nodes->insert( $neighbor, $alt );
                }
            }
            $nodes->next();
        }

        return $distances;
    }

    public function __toString()
    {
        return print_r( $this->verticies, true );
    }
}
