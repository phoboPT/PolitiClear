import Cookies from 'js-cookie';

// Used by all
const sendRequest = async (metodh, url, params) => {
  const requestMetadata = {
    method: metodh,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  const response = await fetch(url, requestMetadata)
    .then((res) => res.json())
    .then(
      (data) => ({
        data,
      }),
      (error) => ({ error }),
    );
  return response;
};

const deleteByKey = async (url, params) => {
  const requestMetadata = {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      key: params,
    },
  };
  const response = await fetch(url, requestMetadata)
    .then((res) => res.json())
    .then(
      (data) => ({
        data,
      }),
      (error) => ({ error }),
    );
  return response;
};

const getUser = async (recipeUrl) => {
  const token = Cookies.get('token');
  const id = { token };

  const data = await sendRequest('POST', recipeUrl, id);
  if (data.error) {
    return {
      isLoaded: true,
      items: data,
    };
  }
  const res = {
    isLoaded: true,
    items: data.data,
  };

  return res;
};

const login = async (recipeUrl, email, password) => {
  console.log(email, password);
  const response = await sendRequest('POST', recipeUrl, { email, password });
  Cookies.set('token', response.data.token, {
    path: '',
    expires: 1000 * 24 * 365 * 60 * 60, // 1 year cookie
  });
  //
  return response;
};

const logout = () => {
  Cookies.set('token', '');
};

const update = async (dataToUpdate) => {
  const recipeUrl = 'http://127.0.0.1:5000/users/update';
  const token = Cookies.get('token');
  const dataUpdated = { ...dataToUpdate, token };

  const data = await sendRequest('PUT', recipeUrl, dataUpdated);
  return data;
};

const signup = async (userData) => {
  const recipeUrl = 'http://127.0.0.1:5000/users/create';

  const data = await sendRequest('POST', recipeUrl, userData);
  console.log(data.data);
  Cookies.set('token', data.data.token, {
    path: '',
    expires: 1000 * 24 * 365 * 60 * 60, // 1 year cookie
  });

  if (data.error) {
    return {
      isLoaded: true,
      data,
    };
  }
  const res = {
    isLoaded: true,
    data: { data: 'Created' },
  };

  return res;
};

const search = async (url, searchTerm) => {
  const requestMetadata = {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      description: searchTerm,
    },
  };

  const response = await fetch(url, requestMetadata)
    .then((res) => res.json())
    .then(
      (data) => ({
        data,
      }),
      (error) => ({ error }),
    );
  return response;
};

const searchNodes = async (url, searchTerm) => {
  const requestMetadata = {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Bypass-Tunnel-Reminder': '1',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      key: searchTerm,
    },
  };

  const response = await fetch(url, requestMetadata)
    .then((res) => res.json())
    .then(
      (data) => ({
        data,
      }),
      (error) => ({ error }),
    );
  return response;
};
const getData = async (url) => {
  const requestMetadata = {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, requestMetadata)
    .then((res) => res.json())
    .then(
      (data) => ({
        data,
      }),
      (error) => ({ error }),
    );
  return response;
};

export {
  getUser,
  login,
  logout,
  signup,
  update,
  search,
  searchNodes,
  getData,
  sendRequest,
  deleteByKey,
};
