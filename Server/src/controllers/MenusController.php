<?php

namespace App\Controllers;

use App\Models\Menu;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use PDO;
use Exception;

class MenusController
{
    protected $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

  
    public function editarMenu(Request $request, Response $response, $args)
    {
        
        $data = $request->getParsedBody(); 
        $files = $request->getUploadedFiles();
    
        
        $requiredFields = ['id_menu', 'nome_prato', 'descricao', 'preco', 'categoria'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                return $this->jsonResponse($response, ['error' => "Campo obrigatório ausente: $field"], 400);
            }
        }
    
        
        $imagemBinaria = null;
        if (!empty($files['imagem']) && $files['imagem']->getError() === UPLOAD_ERR_OK) {
            
            $image = $files['imagem'];
            $imagemBinaria = file_get_contents($image->getStream()->getMetadata('uri'));
        }
    
        
        try {
            
            $stmt = $this->pdo->prepare("CALL sp_AtualizarMenu(:id_menu, :nome_prato, :descricao, :preco, :categoria, :imagem)");
    
            
            $stmt->bindParam(':id_menu', $data['id_menu'], PDO::PARAM_INT);
            $stmt->bindParam(':nome_prato', $data['nome_prato'], PDO::PARAM_STR);
            $stmt->bindParam(':descricao', $data['descricao'], PDO::PARAM_STR);
            $stmt->bindParam(':preco', $data['preco'], PDO::PARAM_STR); 
            $stmt->bindParam(':categoria', $data['categoria'], PDO::PARAM_STR);
            $stmt->bindParam(':imagem', $imagemBinaria, PDO::PARAM_LOB); 
    
            
            $stmt->execute();
    
            return $this->jsonResponse($response, ['status' => 'success', 'message' => 'Menu atualizado com sucesso!'], 200);
    
        } catch (Exception $e) {
          
            return $this->jsonResponse($response, ['error' => 'Erro ao atualizar o menu: ' . $e->getMessage()], 500);
        }
    }
    

    
    public function deleteMenu($request, $response, $args)
    {
    
        $data = json_decode($request->getBody()->getContents(), true);

    
        if (!isset($data['id_menu'])) {
            return $this->jsonResponse($response, ['error' => 'ID do menu é obrigatório.'], 400);
        }
    
        $id_menu = $data['id_menu'];
    
        
        try {
            $stmt = $this->pdo->prepare("CALL sp_RemoverMenu(:id_menu)");
            $stmt->bindParam(':id_menu', $id_menu, PDO::PARAM_INT);
            $stmt->execute();
    
            
            if ($stmt->rowCount() > 0) {
                return $this->jsonResponse($response, [
                    'status' => 'success',
                    'message' => 'Menu excluído com sucesso!'
                ], 200);
            } else {
                return $this->jsonResponse($response, ['error' => 'Menu não encontrado'], 404);
            }
        } catch (Exception $e) {
            return $this->jsonResponse($response, ['error' => 'Erro ao excluir o menu: ' . $e->getMessage()], 500);
        }

    }

    
    private function jsonResponse(Response $response, array $data, int $status)
    {
        try {
            $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR | JSON_INVALID_UTF8_IGNORE);
        } catch (JsonException $e) {
            $json = json_encode(['error' => 'Erro ao converter resposta para JSON.', 'details' => $e->getMessage()]);
            $status = 500;
        }

        $response->getBody()->write($json);
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }
}
