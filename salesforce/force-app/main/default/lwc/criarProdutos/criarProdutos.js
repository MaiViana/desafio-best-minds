import { LightningElement,wire,track,api} from 'lwc';
import criarProdutos from '@salesforce/apex/GerenciadorProdutosController.criarProdutos';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class CriarProdutos extends LightningElement {
    produtoRecords;
    inputForms={};

    @api recordId;
    @api objetoApiName;

    handleChange(event){
        console.log('event.detals.name '+event.target.name+' : '+event.target.value);
       
        if(event.target.name=='nomeProduto'){
            this.nomeProduto = event.target.value;
        }

        if(event.target.name=='codigoProduto'){
            this.codigoProduto = event.target.value;
        }

        if(event.target.name=='descricaoProduto'){
            this.descricaoProduto = event.target.value;
        }

        if(event.target.name=='precoPrprecoProdutooduto'){
            this.precoProduto = event.target.value;
        }
    }

    submitForm(event){
        let produtoSubmitForm ={
            Id:this.recordId,
            Name:this.nomeProduto,
            Codigo_do_produto__c:this.codigoProduto,
            Descricao_do_produto__c:this.descricaoProduto,
            Preco_do_produto__c:this.precoProduto
        }

        let produtoString = JSON.stringify(produtoSubmitForm);

        criarProdutos({produtoJSON:produtoString})
        .then((produto) => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Sucesso",
                    message: "Produto criado com sucesso!",
                    variant: "success"
                })
            );
        })
        .catch((error) => {
            console.log('error: ',error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Erro",
                    message: error.body.message,
                    variant: "error"
                })
            );
        });
    }
}