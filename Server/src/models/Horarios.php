<?php

namespace App\Models;

class Horarios
{
    private $id_horarios;
    private $id_restaurante;
    private $dia_semana;      
    private $horario_inicio;
    private $horario_fim;
    private $capacidade;

    public function __construct($id_horarios = null, $id_restaurante = null, $dia_semana = null, $horario_inicio = null, $horario_fim = null, $capacidade = null)
    {
        $this->id_horarios = $id_horarios;
        $this->id_restaurante = $id_restaurante;
        $this->dia_semana = $dia_semana; 
        $this->horario_inicio = $horario_inicio;
        $this->horario_fim = $horario_fim;
        $this->capacidade = $capacidade;
    }

  
    public function toArray()
    {
        return [
            'id_horarios' => $this->id_horarios,
            'id_restaurante' => $this->id_restaurante,
            'dia_semana' => $this->dia_semana,
            'horario_inicio' => $this->horario_inicio,
            'horario_fim' => $this->horario_fim,
            'capacidade' => $this->capacidade
        ];
    }

    // Getters

    public function getIdHorarios()
    {
        return $this->id_horarios;
    }

    public function getIdRestaurante()
    {
        return $this->id_restaurante;
    }

    public function getDiaSemana()
    {
        return $this->dia_semana;
    }

    public function getHorarioInicio()
    {
        return $this->horario_inicio;
    }

    public function getHorarioFim()
    {
        return $this->horario_fim;
    }

    public function getCapacidade()
    {
        return $this->capacidade;
    }

    // Setters

    public function setIdHorarios($id_horarios)
    {
        $this->id_horarios = $id_horarios;
    }

    public function setIdRestaurante($id_restaurante)
    {
        $this->id_restaurante = $id_restaurante;
    }

    public function setDiaSemana($dia_semana)
    {
        $this->dia_semana = $dia_semana;
    }

    public function setHorarioInicio($horario_inicio)
    {
        $this->horario_inicio = $horario_inicio;
    }

    public function setHorarioFim($horario_fim)
    {
        $this->horario_fim = $horario_fim;
    }

    public function setCapacidade($capacidade)
    {
        $this->capacidade = $capacidade;
    }
}
