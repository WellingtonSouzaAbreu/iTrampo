import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Login from './../components/content/Login.jsx'
import Cadastro from './../components/content/Cadastro.jsx'
import Feed from './../components/content/Feed.jsx'
import promotionalPackages from './../components/content/PacotesPromocionais.jsx'
import ServicosTrampeiro from './../components/content/user-trampeiro/ServicosTrampeiro.jsx'
import ComoFunciona from './../components/content/ComoFunciona.jsx'
import PerfilProprio from './../components/content/PerfilProprio.jsx'
import SolicitacaoServico from './../components/content/user-empregador/SolicitacaoServico.jsx'
import DetalhesServicoTrampeiro from './../components/content/user-trampeiro/DetalhesServicoTrampeiro.jsx'
import ServicosEmpregador from './../components/content/user-empregador/ServicosEmpregador.jsx'
import DetalhesServicoEmpregador from './../components/content/user-empregador/DetalhesServicoEmpregador.jsx'
import PerfilVisualizar from './../components/content/PerfilVisualizar.jsx'


export default props =>
    <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/cadastro" component={Cadastro} />
        <Route exact path="/feed" component={Feed} />
        <Route exact path="/pacotes-promocionais" component={promotionalPackages} />
        <Route exact path="/servicos-trampeiro" component={ServicosTrampeiro} />
        <Route exact path="/como-funciona" component={ComoFunciona} />
        <Route exact path="/perfil-proprio" component={PerfilProprio} />
        <Route exact path="/solicitacao-servico" component={SolicitacaoServico} />
        <Route exact path="/detalhes-servico-trampeiro/:id" component={DetalhesServicoTrampeiro} />
        <Route exact path="/servicos-empregador" component={ServicosEmpregador} />
        <Route exact path="/detalhes-servico-empregador" component={DetalhesServicoEmpregador} />
        <Route exact path="/perfil-visualizar/:id" component={PerfilVisualizar} />
        

        <Redirect from="*" to="/signup" />
    </Switch>