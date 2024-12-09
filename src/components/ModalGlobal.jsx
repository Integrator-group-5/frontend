import React from 'react'
import { useContextGlobal } from "../context/globalContext"
import stylesHeart from "../styles/heart.module.css";
import Modal from './Modal';


const ModalGlobal = () => {
    const {state, dispatch}= useContextGlobal();

    if(!state.modalData.isOpen){
        return null;
    }   

    const handleClose=()=>{
      if(state.modalData.onClose){
        state.modalData.onClose();
        dispatch({type: "HIDE_MODAL_GLOBAL"});
      }
      else{
        dispatch({type: "HIDE_MODAL_GLOBAL"})
      }   
    }
    const handleClose2=()=>{
      if(state.modalData.onClose){
        state.modalData.onClose2();
        dispatch({type: "HIDE_MODAL_GLOBAL"});
      }
    }
    
  return (
    <div className={stylesHeart.modalOverlay}>
        <Modal
        img={state.modalData.img}
        titulo={state.modalData.titulo}
        subtitulo={state.modalData.subtitulo}
        mensaje={state.modalData.mensaje}
        onClose={handleClose}
        onClose2={handleClose2}
        boton2={state.modalData.mensaje2}
        label={state.modalData.label}
        />
  </div>
  )
}

export default ModalGlobal