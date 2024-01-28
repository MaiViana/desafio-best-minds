import { LightningElement,api,wire} from 'lwc';
import { getRecord,getFieldValue  } from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

//Campos de produtos
import Nome_do_produto from '@salesforce/schema/Produto__c.Name';
import Codigo_do_produto from '@salesforce/schema/Produto__c.Codigo_do_produto__c';
import Descricao_do_produto from '@salesforce/schema/Produto__c.Descricao_do_produto__c';
import Preco_do_produto from '@salesforce/schema/Produto__c.Preco_do_produto__c';

import atualizarProdutos from '@salesforce/apex/GerenciadorProdutosController.atualizarProdutos';

export default class CriaAtualizaProdutos extends LightningElement {
    inputForm={};

    @api recordId;

    nomeProduto;
    codigoProduto;
    descricaoProduto;
    precoProduto;
    
    handleChange(event){
        console.log('event.detals.name '+event.target.name+' : '+event.target.value);
       
        if(event.target.name=='nomeProduto'){
            this.nomeProduto = event.target.value;
        }

        if(event.target.name=='codProduto'){
            this.codigoProduto = event.target.value;
        }

        if(event.target.name=='descProduto'){
            this.descricaoProduto = event.target.value;
        }

        if(event.target.name=='precoProduto'){
            this.precoProduto = event.target.value;
        }
    }   
    
    @wire(getRecord, {
        recordId: "$recordId",
        fields: [Nome_do_produto,Codigo_do_produto,Descricao_do_produto,Preco_do_produto]
    })
    record({ data, error }) {
        if(data){
            console.log('data : ',data);

            this.nomeProduto = getFieldValue(data, Nome_do_produto);
            this.codigoProduto = getFieldValue(data, Codigo_do_produto);
            this.descricaoProduto = getFieldValue(data, Descricao_do_produto);
            this.precoProduto = getFieldValue(data, Preco_do_produto);

            this.camposProduto = data;
        } else if (error) {
            console.log("error", error);
        }
    }

    submitForm(event){
        console.log('handle submit');
        let produtoSubmitForm ={
            Id:this.recordId,
            Name:this.nomeProduto,
            Codigo_do_produto__c:this.codigoProduto,
            Descricao_do_produto__c:this.descricaoProduto,
            Preco_do_produto__c:this.precoProduto
        }

        let produtoString = JSON.stringify(produtoSubmitForm);
        atualizarProdutos({produtoJSON:produtoString})
        .then((produto) => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Sucesso",
                    message: "Produto atualizado com sucesso!",
                    variant: "success"
                })
            );
        })

        .catch((error) => {
            console.log('error: ', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Erro",
                    message: error.body.message,
                    variante: "error"
                })
            );
        })
        .finally(() => {
            this.isLoading = false;
        });
    }
}