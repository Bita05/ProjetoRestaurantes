<?php

namespace App\Models;

class Menu
{
    private $id_menu;
    private $id_restaurante;
    private $nome_prato;
    private $descricao;
    private $preco;
    private $categoria;
    private $imagem;

    
    public function __construct($id_menu = null, $id_restaurante = null, $nome_prato = null, $descricao = null, $preco = null, $categoria = null, $imagem = null)
    {
        $this->id_menu = $id_menu;
        $this->id_restaurante = $id_restaurante;
        $this->nome_prato = $nome_prato;
        $this->descricao = $descricao;
        $this->preco = $preco;
        $this->categoria = $categoria;
        $this->imagem = $imagem;
    }

    public function toArray()
    {
        return [
            'id_menu' => $this->id_menu,
            'id_restaurante' => $this->id_restaurante,
            'nome_prato' => $this->nome_prato,
            'descricao' => $this->descricao,
            'preco' => $this->preco,
            'categoria' => $this->categoria,
            'imagem' => $this->imagem
        ];
    }

   
    public function getIdMenu()
    {
        return $this->id_menu;
    }

    public function getIdRestaurante()
    {
        return $this->id_restaurante;
    }

    public function getNomePrato()
    {
        return $this->nome_prato;
    }

    public function getDescricao()
    {
        return $this->descricao;
    }

    public function getPreco()
    {
        return $this->preco;
    }

    public function getCategoria()
    {
        return $this->categoria;
    }

    public function getImagem()
    {
        return $this->imagem;
    }

    public function setIdMenu($id_menu)
    {
        $this->id_menu = $id_menu;
    }

    public function setIdRestaurante($id_restaurante)
    {
        $this->id_restaurante = $id_restaurante;
    }

    public function setNomePrato($nome_prato)
    {
        $this->nome_prato = $nome_prato;
    }

    public function setDescricao($descricao)
    {
        $this->descricao = $descricao;
    }

    public function setPreco($preco)
    {
        $this->preco = $preco;
    }

    public function setCategoria($categoria)
    {
        $this->categoria = $categoria;
    }

    public function setImagem($imagem)
    {
        $this->imagem = $imagem;
    }
}
