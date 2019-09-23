[@daostack/client](../README.md) › [Globals](../globals.md) › [IObservable](iobservable.md)

# Interface: IObservable <**T**>

## Type parameters

▪ **T**

## Hierarchy

* Observable‹T›

  ↳ **IObservable**

## Implements

* Subscribable‹T›

## Index

### Constructors

* [constructor](iobservable.md#constructor)

### Properties

* [_isScalar](iobservable.md#_isscalar)
* [first](iobservable.md#first)
* [operator](iobservable.md#operator)
* [source](iobservable.md#source)
* [create](iobservable.md#static-create)
* [if](iobservable.md#static-if)
* [throw](iobservable.md#static-throw)

### Methods

* [_subscribe](iobservable.md#_subscribe)
* [_trySubscribe](iobservable.md#_trysubscribe)
* [forEach](iobservable.md#foreach)
* [lift](iobservable.md#lift)
* [pipe](iobservable.md#pipe)
* [subscribe](iobservable.md#subscribe)
* [toPromise](iobservable.md#topromise)

## Constructors

###  constructor

\+ **new IObservable**(`subscribe?`: undefined | function): *[IObservable](iobservable.md)*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:19

**`constructor`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`subscribe?` | undefined &#124; function | the function that is called when the Observable is initially subscribed to. This function is given a Subscriber, to which new values can be `next`ed, or an `error` method can be called to raise an error, or `complete` can be called to notify of a successful completion.  |

**Returns:** *[IObservable](iobservable.md)*

## Properties

###  _isScalar

• **_isScalar**: *boolean*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:15

Internal implementation detail, do not use directly.

___

###  first

• **first**: *function*

*Defined in [graphnode.ts:23](https://github.com/daostack/client/blob/c62f433/src/graphnode.ts#L23)*

#### Type declaration:

▸ (): *T*

___

###  operator

• **operator**: *Operator‹any, T›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:19

**`deprecated`** This is an internal implementation detail, do not use.

___

###  source

• **source**: *Observable‹any›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:17

**`deprecated`** This is an internal implementation detail, do not use.

___

### `Static` create

▪ **create**: *Function*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:38

Creates a new cold Observable by calling the Observable constructor

**`static`** true

**`owner`** Observable

**`method`** create

**`param`** the subscriber function to be passed to the Observable constructor

**`returns`** a new cold observable

**`nocollapse`** 

**`deprecated`** use new Observable() instead

___

### `Static` if

▪ **if**: *iif*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:71

**`nocollapse`** 

**`deprecated`** In favor of iif creation function: import { iif } from 'rxjs';

___

### `Static` throw

▪ **throw**: *throwError*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:76

**`nocollapse`** 

**`deprecated`** In favor of throwError creation function: import { throwError } from 'rxjs';

## Methods

###  _subscribe

▸ **_subscribe**(`subscriber`: Subscriber‹any›): *TeardownLogic*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:66

**`internal`** This is an internal implementation detail, do not use.

**Parameters:**

Name | Type |
------ | ------ |
`subscriber` | Subscriber‹any› |

**Returns:** *TeardownLogic*

___

###  _trySubscribe

▸ **_trySubscribe**(`sink`: Subscriber‹T›): *TeardownLogic*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:56

**`deprecated`** This is an internal implementation detail, do not use.

**Parameters:**

Name | Type |
------ | ------ |
`sink` | Subscriber‹T› |

**Returns:** *TeardownLogic*

___

###  forEach

▸ **forEach**(`next`: function, `promiseCtor?`: PromiseConstructorLike): *Promise‹void›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:64

**`method`** forEach

**Parameters:**

▪ **next**: *function*

a handler for each value emitted by the observable

▸ (`value`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

▪`Optional`  **promiseCtor**: *PromiseConstructorLike*

**Returns:** *Promise‹void›*

a promise that either resolves on observable completion or
 rejects with the handled error

___

###  lift

▸ **lift**<**R**>(`operator`: Operator‹T, R›): *Observable‹R›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:46

Creates a new Observable, with this Observable as the source, and the passed
operator defined as the new observable's operator.

**`method`** lift

**Type parameters:**

▪ **R**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`operator` | Operator‹T, R› | the operator defining the operation to take on the observable |

**Returns:** *Observable‹R›*

a new observable with the Operator applied

___

###  pipe

▸ **pipe**(): *Observable‹T›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:77

**Returns:** *Observable‹T›*

▸ **pipe**<**A**>(`op1`: OperatorFunction‹T, A›): *Observable‹A›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:78

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type |
------ | ------ |
`op1` | OperatorFunction‹T, A› |

**Returns:** *Observable‹A›*

▸ **pipe**<**A**, **B**>(`op1`: OperatorFunction‹T, A›, `op2`: OperatorFunction‹A, B›): *Observable‹B›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:79

**Type parameters:**

▪ **A**

▪ **B**

**Parameters:**

Name | Type |
------ | ------ |
`op1` | OperatorFunction‹T, A› |
`op2` | OperatorFunction‹A, B› |

**Returns:** *Observable‹B›*

▸ **pipe**<**A**, **B**, **C**>(`op1`: OperatorFunction‹T, A›, `op2`: OperatorFunction‹A, B›, `op3`: OperatorFunction‹B, C›): *Observable‹C›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:80

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

**Parameters:**

Name | Type |
------ | ------ |
`op1` | OperatorFunction‹T, A› |
`op2` | OperatorFunction‹A, B› |
`op3` | OperatorFunction‹B, C› |

**Returns:** *Observable‹C›*

▸ **pipe**<**A**, **B**, **C**, **D**>(`op1`: OperatorFunction‹T, A›, `op2`: OperatorFunction‹A, B›, `op3`: OperatorFunction‹B, C›, `op4`: OperatorFunction‹C, D›): *Observable‹D›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:81

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

**Parameters:**

Name | Type |
------ | ------ |
`op1` | OperatorFunction‹T, A› |
`op2` | OperatorFunction‹A, B› |
`op3` | OperatorFunction‹B, C› |
`op4` | OperatorFunction‹C, D› |

**Returns:** *Observable‹D›*

▸ **pipe**<**A**, **B**, **C**, **D**, **E**>(`op1`: OperatorFunction‹T, A›, `op2`: OperatorFunction‹A, B›, `op3`: OperatorFunction‹B, C›, `op4`: OperatorFunction‹C, D›, `op5`: OperatorFunction‹D, E›): *Observable‹E›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:82

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

**Parameters:**

Name | Type |
------ | ------ |
`op1` | OperatorFunction‹T, A› |
`op2` | OperatorFunction‹A, B› |
`op3` | OperatorFunction‹B, C› |
`op4` | OperatorFunction‹C, D› |
`op5` | OperatorFunction‹D, E› |

**Returns:** *Observable‹E›*

▸ **pipe**<**A**, **B**, **C**, **D**, **E**, **F**>(`op1`: OperatorFunction‹T, A›, `op2`: OperatorFunction‹A, B›, `op3`: OperatorFunction‹B, C›, `op4`: OperatorFunction‹C, D›, `op5`: OperatorFunction‹D, E›, `op6`: OperatorFunction‹E, F›): *Observable‹F›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:83

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

▪ **F**

**Parameters:**

Name | Type |
------ | ------ |
`op1` | OperatorFunction‹T, A› |
`op2` | OperatorFunction‹A, B› |
`op3` | OperatorFunction‹B, C› |
`op4` | OperatorFunction‹C, D› |
`op5` | OperatorFunction‹D, E› |
`op6` | OperatorFunction‹E, F› |

**Returns:** *Observable‹F›*

▸ **pipe**<**A**, **B**, **C**, **D**, **E**, **F**, **G**>(`op1`: OperatorFunction‹T, A›, `op2`: OperatorFunction‹A, B›, `op3`: OperatorFunction‹B, C›, `op4`: OperatorFunction‹C, D›, `op5`: OperatorFunction‹D, E›, `op6`: OperatorFunction‹E, F›, `op7`: OperatorFunction‹F, G›): *Observable‹G›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:84

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

▪ **F**

▪ **G**

**Parameters:**

Name | Type |
------ | ------ |
`op1` | OperatorFunction‹T, A› |
`op2` | OperatorFunction‹A, B› |
`op3` | OperatorFunction‹B, C› |
`op4` | OperatorFunction‹C, D› |
`op5` | OperatorFunction‹D, E› |
`op6` | OperatorFunction‹E, F› |
`op7` | OperatorFunction‹F, G› |

**Returns:** *Observable‹G›*

▸ **pipe**<**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**>(`op1`: OperatorFunction‹T, A›, `op2`: OperatorFunction‹A, B›, `op3`: OperatorFunction‹B, C›, `op4`: OperatorFunction‹C, D›, `op5`: OperatorFunction‹D, E›, `op6`: OperatorFunction‹E, F›, `op7`: OperatorFunction‹F, G›, `op8`: OperatorFunction‹G, H›): *Observable‹H›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:85

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

▪ **F**

▪ **G**

▪ **H**

**Parameters:**

Name | Type |
------ | ------ |
`op1` | OperatorFunction‹T, A› |
`op2` | OperatorFunction‹A, B› |
`op3` | OperatorFunction‹B, C› |
`op4` | OperatorFunction‹C, D› |
`op5` | OperatorFunction‹D, E› |
`op6` | OperatorFunction‹E, F› |
`op7` | OperatorFunction‹F, G› |
`op8` | OperatorFunction‹G, H› |

**Returns:** *Observable‹H›*

▸ **pipe**<**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**>(`op1`: OperatorFunction‹T, A›, `op2`: OperatorFunction‹A, B›, `op3`: OperatorFunction‹B, C›, `op4`: OperatorFunction‹C, D›, `op5`: OperatorFunction‹D, E›, `op6`: OperatorFunction‹E, F›, `op7`: OperatorFunction‹F, G›, `op8`: OperatorFunction‹G, H›, `op9`: OperatorFunction‹H, I›): *Observable‹I›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:86

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

▪ **F**

▪ **G**

▪ **H**

▪ **I**

**Parameters:**

Name | Type |
------ | ------ |
`op1` | OperatorFunction‹T, A› |
`op2` | OperatorFunction‹A, B› |
`op3` | OperatorFunction‹B, C› |
`op4` | OperatorFunction‹C, D› |
`op5` | OperatorFunction‹D, E› |
`op6` | OperatorFunction‹E, F› |
`op7` | OperatorFunction‹F, G› |
`op8` | OperatorFunction‹G, H› |
`op9` | OperatorFunction‹H, I› |

**Returns:** *Observable‹I›*

▸ **pipe**<**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**, **I**>(`op1`: OperatorFunction‹T, A›, `op2`: OperatorFunction‹A, B›, `op3`: OperatorFunction‹B, C›, `op4`: OperatorFunction‹C, D›, `op5`: OperatorFunction‹D, E›, `op6`: OperatorFunction‹E, F›, `op7`: OperatorFunction‹F, G›, `op8`: OperatorFunction‹G, H›, `op9`: OperatorFunction‹H, I›, ...`operations`: OperatorFunction‹any, any›[]): *Observable‹__type›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:87

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

▪ **F**

▪ **G**

▪ **H**

▪ **I**

**Parameters:**

Name | Type |
------ | ------ |
`op1` | OperatorFunction‹T, A› |
`op2` | OperatorFunction‹A, B› |
`op3` | OperatorFunction‹B, C› |
`op4` | OperatorFunction‹C, D› |
`op5` | OperatorFunction‹D, E› |
`op6` | OperatorFunction‹E, F› |
`op7` | OperatorFunction‹F, G› |
`op8` | OperatorFunction‹G, H› |
`op9` | OperatorFunction‹H, I› |
`...operations` | OperatorFunction‹any, any›[] |

**Returns:** *Observable‹__type›*

___

###  subscribe

▸ **subscribe**(`observer?`: PartialObserver‹T›): *Subscription*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`observer?` | PartialObserver‹T› |

**Returns:** *Subscription*

▸ **subscribe**(`next`: null | undefined, `error`: null | undefined, `complete`: function): *Subscription*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:49

**`deprecated`** Use an observer instead of a complete callback

**Parameters:**

▪ **next**: *null | undefined*

▪ **error**: *null | undefined*

▪ **complete**: *function*

▸ (): *void*

**Returns:** *Subscription*

▸ **subscribe**(`next`: null | undefined, `error`: function, `complete?`: undefined | function): *Subscription*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:51

**`deprecated`** Use an observer instead of an error callback

**Parameters:**

▪ **next**: *null | undefined*

▪ **error**: *function*

▸ (`error`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error` | any |

▪`Optional`  **complete**: *undefined | function*

**Returns:** *Subscription*

▸ **subscribe**(`next`: function, `error`: null | undefined, `complete`: function): *Subscription*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:53

**`deprecated`** Use an observer instead of a complete callback

**Parameters:**

▪ **next**: *function*

▸ (`value`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

▪ **error**: *null | undefined*

▪ **complete**: *function*

▸ (): *void*

**Returns:** *Subscription*

▸ **subscribe**(`next?`: undefined | function, `error?`: undefined | function, `complete?`: undefined | function): *Subscription*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:54

**Parameters:**

Name | Type |
------ | ------ |
`next?` | undefined &#124; function |
`error?` | undefined &#124; function |
`complete?` | undefined &#124; function |

**Returns:** *Subscription*

___

###  toPromise

▸ **toPromise**<**T**>(`this`: Observable‹T›): *Promise‹T›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:88

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`this` | Observable‹T› |

**Returns:** *Promise‹T›*

▸ **toPromise**<**T**>(`this`: Observable‹T›, `PromiseCtor`: PromiseConstructor): *Promise‹T›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:89

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`this` | Observable‹T› |
`PromiseCtor` | PromiseConstructor |

**Returns:** *Promise‹T›*

▸ **toPromise**<**T**>(`this`: Observable‹T›, `PromiseCtor`: PromiseConstructorLike): *Promise‹T›*

*Inherited from void*

Defined in /media/data2/projects/daostack/client/node_modules/rxjs/internal/Observable.d.ts:90

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`this` | Observable‹T› |
`PromiseCtor` | PromiseConstructorLike |

**Returns:** *Promise‹T›*
