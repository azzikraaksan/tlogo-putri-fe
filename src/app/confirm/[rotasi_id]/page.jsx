// import ClientConfirmPage from "./ClientConfirmPage";

// export default function ConfirmPage({ params }) {
//   return <ClientConfirmPage rotasi_id={params.rotasi_id} />;
// }

import ClientConfirmPage from "./ClientConfirmPage";

export default async function ConfirmPage({ params }) {
  const { rotasi_id } = params;

  return <ClientConfirmPage rotasi_id={rotasi_id} />;
}
