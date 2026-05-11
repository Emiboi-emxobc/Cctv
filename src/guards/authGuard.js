import {Store} from '../store/index.js';

export function authGuard(component){

  const auth = Store.get("auth.authenticated")

  if(!auth){

    Router.navigate("/login")

    return null

  }

  return component()

}