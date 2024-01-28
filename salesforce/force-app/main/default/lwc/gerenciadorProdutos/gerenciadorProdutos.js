import { LightningElement, wire } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { RefreshEvent } from "lightning/refresh";


import buscaProdutos from '@salesforce/apex/GerenciadorProdutosController.buscaProdutos';
import deletaProdutos from '@salesforce/apex/GerenciadorProdutosController.deletaProdutos';

export default class GerenciadorProdutos extends LightningElement {
    listaDeProdutos;
    registroSelecionado;
    mostraFormulario = false;
    mostraFormulariocriar = false;
    
    @wire(buscaProdutos, {})
    produtoRec({ error, data}) {
        if (data) {
            this.listaDeProdutos = data;
        } else if (error){
            console.log('error : ',error);
        }
    }

    deleteProdutotRec(event) {
        let produtoParaSerDeletado = event.currentTarget.dataset.produtoid;
        deletaProdutos({produtoId: produtoParaSerDeletado})
        .then((data) => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Sucesso',
                    message: 'Registro deletado',
                    variant: 'success'
                })
            );
            buscaProdutos({ })
            .then(result => {
                this.listaDeProdutos = result;
            })
            .catch(error => {
                new ShowToastEvent({
                    title: 'Erro ao atualizar lista de registros',
                    message: error.body.message,
                    variant: 'error'
                })
            })
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Erro ao deletar o registro',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        })
        .finally(() => {
            this.isLoading = false;
        });
    }
    
    editaProdutotRec(event) {
        this.registroSelecionado = event.currentTarget.dataset.produtoid;
        this.mostraFormulario = true;
        this.mostraFormulariocriar = false;
    }

    criaProdutotRec(event) {
        this.mostraFormulariocriar = true;
        this.mostraFormulario = false;
    }
    
}