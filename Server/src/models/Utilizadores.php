<?php
namespace App\Models;

class Utilizadores
{
    private $id;
    private $nome;
    private $email;
    private $password;
    private $telefone;
    private $data_registo;
    private $tipo;

    
    public function __construct($id = null, $nome = null, $email = null, $password = null, $telefone = null, $data_registo = null, $tipo = null)
    {
        $this->id = $id;
        $this->nome = $nome;
        $this->email = $email;
        $this->password = $password;
        $this->telefone = $telefone;
        $this->data_registo = $data_registo;
        $this->tipo = $tipo;
    }


     public function toArray()
    {
         return [
            'id' => $this->id,
            'nome' => $this->nome,
            'email' => $this->email,
            'telefone' => $this->telefone,
            'data_registo' => $this->data_registo,
            'tipo' => $this->tipo,
        ];
    }
 
    public function getId()
    {
        return $this->id;
    }

    public function getNome()
    {
        return $this->nome;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function getTelefone()
    {
        return $this->telefone;
    }

    public function getDataRegisto()
    {
        return $this->data_registo;
    }

    public function getTipo()
    {
        return $this->tipo;
    }

    
    public function setId($id)
    {
        $this->id = $id;
    }

    public function setNome($nome)
    {
        $this->nome = $nome;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function setPassword($password)
    {
        $this->password = $password;
    }

    public function setTelefone($telefone)
    {
        $this->telefone = $telefone;
    }

    public function setDataRegisto($data_registo)
    {
        $this->data_registo = $data_registo;
    }

    public function setTipo($tipo)
    {
        $this->tipo = $tipo;
    }


   
}

?>
