<?php

namespace App\Models;

class Reserva
{
    private $id_reserva;
    private $id_restaurante;
    private $id_horario;
    private $id_menu;
    private $id_cliente;
    private $data_reserva_marcada;
    private $data_reserva;
    private $num_pessoas;


    public function __construct($id_reserva = null, $id_restaurante = null, $id_horario = null, $id_menu = null,
        $id_cliente = null, $data_reserva_marcada = null, $data_reserva = null, $num_pessoas = null)
    {
        $this->id_reserva = $id_reserva;
        $this->id_restaurante = $id_restaurante;
        $this->id_horario = $id_horario;
        $this->id_menu = $id_menu;
        $this->id_cliente = $id_cliente;
        $this->data_reserva = $data_reserva;
        $this->data_reserva_marcada = $data_reserva_marcada;
        $this->num_pessoas = $num_pessoas;
    }

    public function toArray()
    {
        return [
            'id_reserva' => $this->id_reserva,
            'id_restaurante' => $this->id_restaurante,
            'id_horario' => $this->id_horario,
            'id_menu' => $this->id_menu,
            'id_cliente' => $this->id_cliente,
            'data_reserva_marcada' => $this->data_reserva_marcada,
            'data_reserva' => $this->data_reserva,
            'num_pessoas' => $this->num_pessoas
        ];
    }

    // Getters
    public function getIdReserva()
    {
        return $this->id_reserva;
    }

    public function getIdRestaurante()
    {
        return $this->id_restaurante;
    }

    public function getIdHorario()
    {
        return $this->id_horario;
    }

    public function getIdMenu()
    {
        return $this->id_menu;
    }

    public function getIdCliente()
    {
        return $this->id_cliente;
    }

    public function getDataReservaMarcada()
    {
        return $this->data_reserva_marcada;
    }

    public function getDataReserva()
    {
        return $this->data_reserva;
    }

    public function getNumPessoas()
    {
        return $this->num_pessoas;
    }

    // Setters
    public function setIdReserva($id_reserva)
    {
        $this->id_reserva = $id_reserva;
    }

    public function setIdRestaurante($id_restaurante)
    {
        $this->id_restaurante = $id_restaurante;
    }

    public function setIdHorario($id_horario)
    {
        $this->id_horario = $id_horario;
    }

    public function setIdMenu($id_menu)
    {
        $this->id_menu = $id_menu;
    }

    public function setIdCliente($id_cliente)
    {
        $this->id_cliente = $id_cliente;
    }
    
    public function setDataReservaMarcada($data_reserva_marcada)
    {
        $this->data_reserva_marcada = $data_reserva_marcada;
    }

    public function setDataReserva($data_reserva)
    {
        $this->data_reserva = $data_reserva;
    }

    public function setNumPessoas($num_pessoas)
    {
        $this->num_pessoas = $num_pessoas;
    }
}
