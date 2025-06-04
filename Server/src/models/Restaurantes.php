<?php
namespace App\Models;

class Restaurantes
{
    private $id_restaurante;
    private $nome;
    private $imagem;
    private $descricao;
    private $localizacao;
    private $cidade;
    private $pais;
    private $horario;
    private $ativo;
    private $id_utilizador;

    
    public function __construct(
        $id_restaurante = null,
        $nome = null,
        $imagem = null,
        $descricao = null,
        $localizacao = null,
        $cidade = null,
        $pais = null,
        $horario = null,
        $id_utilizador = null,
        $ativo = null
    ) {
        $this->id_restaurante = $id_restaurante;
        $this->nome = $nome;
        $this->imagem = $imagem;
        $this->descricao = $descricao;
        $this->localizacao = $localizacao;
        $this->cidade = $cidade;
        $this->pais = $pais;
        $this->horario = $horario;
        $this->id_utilizador = $id_utilizador;
        $this->ativo = $ativo;
    }


    public function toArray()
    {
        return [
            'id_restaurante' => $this->id_restaurante,
            'nome' => $this->nome,
            'imagem' => $this->imagem,
            'descricao' => $this->descricao,
            'localizacao' => $this->localizacao,
            'cidade' => $this->cidade,
            'pais' => $this->pais,
            'horario' => $this->horario,
            'ativo' => $this->ativo,
            'id_utilizador' => $this->id_utilizador
        ];
    }

   
    public function getIdRestaurante()
    {
        return $this->id_restaurante;
    }

    public function getNome()
    {
        return $this->nome;
    }

    public function getImagem()
    {
        return $this->imagem;
    }

    public function getDescricao()
    {
        return $this->descricao;
    }

    public function getLocalizacao()
    {
        return $this->localizacao;
    }

    public function getCidade()
    {
        return $this->cidade;
    }

    public function getPais()
    {
        return $this->pais;
    }

    public function getHorario()
    {
        return $this->horario;
    }

    public function getAtivo()
    {
        return $this->ativo;
    }

    public function getIdUtilizador()
    {
        return $this->id_utilizador;
    }

    
    public function setIdRestaurante($id_restaurante)
    {
        $this->id_restaurante = $id_restaurante;
    }

    public function setNome($nome)
    {
        $this->nome = $nome;
    }

    public function setImagem($imagem)
    {
        $this->imagem = $imagem;
    }

    public function setDescricao($descricao)
    {
        $this->descricao = $descricao;
    }

    public function setLocalizacao($localizacao)
    {
        $this->localizacao = $localizacao;
    }

    public function setCidade($cidade)
    {
        $this->cidade = $cidade;
    }

    public function setPais($pais)
    {
        $this->pais = $pais;
    }

    public function setHorario($horario)
    {
        $this->horario = $horario;
    }

    public function setAtivo($ativo)
    {
        $this->ativo = $ativo;
    }

    public function setIdUtilizador($id_utilizador)
    {
        $this->id_utilizador = $id_utilizador;
    }
}

?>