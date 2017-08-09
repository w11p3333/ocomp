// @flow

type OCOMP_LIFE_CYCLE = ?{
  init: ?Function,
  ready: ?Function,
  destory: ?Function
}

export default function (lifeCycle: OCOMP_LIFE_CYCLE): Object {
  return lifeCycle ?
  {
    created: lifeCycle.init,
    mounted: lifeCycle.ready,
    destoryed: lifeCycle.destory
  }
  : {}
}