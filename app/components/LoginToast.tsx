'use client';

import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';

const LoginToast = () => {
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') !== 'not-invited-yet') return;

    toastRef.current?.show({
      severity: 'info',
      summary: 'Request access',
      detail: (
        <>
          <p>Spotify login is limited to invited accounts for apps in development mode.</p>
          <p>
            To request access, <a href="mailto:weverhall@gmail.com">send me an email</a> with your
            Spotify account email.
          </p>
        </>
      ),
      life: 15000,
    });

    window.history.replaceState(null, '', '/');
  }, []);

  return <Toast ref={toastRef} position="top-center" className="toast" />;
};

export default LoginToast;
