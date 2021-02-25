import { ISimpleMessagePopupProps } from "components/Shared/SimpleMessagePopup";

export enum ActionTypes {
  SHOW_TOUR = "SHOW_TOUR",
  HIDE_TOUR = "HIDE_TOUR",
  SHOW_MENU = "SHOW_MENU",
  HIDE_MENU = "HIDE_MENU",
  SHOW_SIMPLE_MESSAGE = "SHOW_SIMPLE_MESSAGE",
  HIDE_SIMPLE_MESSAGE = "HIDE_SIMPLE_MESSAGE",
}

export interface IUIState {
  menuOpen: boolean;
  simpleMessageOpen: boolean;
  simpleMessageOptions: ISimpleMessagePopupProps;
  tourVisible: boolean;
}

const initialState: IUIState = {
  menuOpen: false,
  simpleMessageOpen: false,
  simpleMessageOptions: { body: "" },
  tourVisible: false,
};

const uiReducer = (state = initialState, action: any) => {
  switch (action.type) {

    case ActionTypes.SHOW_TOUR:
      return { ...state, tourVisible: true };

    case ActionTypes.HIDE_TOUR:
      return { ...state, tourVisible: false };

    case ActionTypes.SHOW_MENU:
      return { ...state, menuOpen: true };

    case ActionTypes.HIDE_MENU:
      return { ...state, menuOpen: false };

    case ActionTypes.SHOW_SIMPLE_MESSAGE:
      return { ...state, simpleMessageOpen: true, simpleMessageOptions: action.options };

    case ActionTypes.HIDE_SIMPLE_MESSAGE:
      return { ...state, simpleMessageOpen: false };

    default: {
      return state;
    }
  }
};

export default uiReducer;
