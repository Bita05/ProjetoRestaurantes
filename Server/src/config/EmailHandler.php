<?php

namespace App\config;


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;



class EmailHandler
{
    public static function enviarEmailAprovacao($destinatario, $nome)
    {
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'brunombita@gmail.com';         // Coloca aqui o teu e-mail
            $mail->Password = 'qerd bwko huym xhrf';           // A App Password que criaste
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            $mail->setFrom('brunombita@gmail.com', 'MesaFácil');
            $mail->addAddress($destinatario, $nome);

            $mail->isHTML(true);
            $mail->Subject = 'Pedido de registo aprovado';
            $mail->Body    = "
                <h3>Olá {$nome},</h3>
                <p>O seu pedido de registo foi <strong>aprovado</strong>.</p>
                <p>Já pode aceder à plataforma com o seu email.</p>
                <br/>
                <p>Obrigado,<br/>MesaFácil</p>
            ";

            $mail->send();
            return true;

        } catch (Exception $e) {
            error_log("Erro ao enviar e-mail: {$mail->ErrorInfo}");
            return false;
        }
    }
}
