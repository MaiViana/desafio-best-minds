public with sharing class GerenciadorProdutosController {
    @AuraEnabled(cacheable=true)
    public static List<Produto__c> buscaProdutos() {
        try {
            List<Produto__c> listaProdutos = [select id, Name, Codigo_do_produto__c, Descricao_do_produto__c, Preco_do_produto__c from Produto__c];
            return listaProdutos;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }  

    @AuraEnabled
    public static Produto__c criarProdutos(String produtoJSON){
        try {
            Produto__c produto = (Produto__c)JSON.deserialize(produtoJSON,Produto__c.class);
            insert produto;
            return produto;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void atualizarProdutos(String produtoJSON) {
        try{
            Produto__c produto = (Produto__c)JSON.deserialize(produtoJSON,Produto__c.class);
            update produto;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Boolean deletaProdutos(String produtoId) {
        try {
            if(!String.isBlank(produtoId)) {
                Produto__c produto = new Produto__c(Id=produtoId);
                delete produto;
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
}