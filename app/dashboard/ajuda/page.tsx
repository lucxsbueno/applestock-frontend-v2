import React from "react";

export default function AjudaPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Ajuda</h1>
      <p className="mb-8 text-lg text-gray-700">
        Bem-vindo à página de ajuda! Aqui você encontra respostas para as dúvidas mais comuns sobre o uso do sistema.
      </p>
      <div>
        <h2 className="text-xl font-semibold mb-2">Perguntas Frequentes</h2>
        <ul className="space-y-4">
          <li>
            <strong>Como adiciono um novo produto ao estoque?</strong>
            <p>Basta acessar a seção "Meu estoque" e clicar em "Adicionar produto".</p>
          </li>
          <li>
            <strong>Como altero meus dados de perfil?</strong>
            <p>Vá até a seção "Perfil" no menu lateral e edite suas informações.</p>
          </li>
          <li>
            <strong>O que fazer em caso de problemas com fornecedores?</strong>
            <p>Entre em contato com o suporte ou utilize a seção "Fornecedores" para gerenciar seus contatos.</p>
          </li>
        </ul>
      </div>
    </div>
  );
} 