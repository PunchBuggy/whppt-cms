import byEmail from "./byEmail";
import signUp from "./signUp";

export default context => {
  let index = 'whppt';
  const type = 'user';
  if (context.$options && context.$options.index_suffix) {
    index = `whppt_${context.$options.index_suffix}` || "";
  }

  // Ensure that the index exists (I know I'm not waiting for it)
  context.$elastic.indices.exists({index}).then(exists => {
    if (exists) { return }
    console.log('Creating index', index)
    context.$elastic.indices.create({index})
  })

  const args = {
    ...context,
    $indexSettings: {
      index,
      type,
    }
  }

  return {
    byEmail: byEmail(args),
    signUp: signUp(args),
  };
};
