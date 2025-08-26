import Axios from 'axios';
import { history } from '../Routes/routes';
import { store } from '../store/store';
import { logoutUser } from '../store/actions';

const axiosInstance = Axios.create();

axiosInstance.interceptors.request.use(
	(config) => {
		config.headers = {};
		const userInfo = store.getState().login.user
		if (userInfo?.token) {
			config.headers.Authorization = `Bearer ${userInfo.token}`;
		}
		return config;
	},
	(error) => {
		console.log('request error =>', error.response || error)
		return Promise.reject(error)
	},
)

axiosInstance.interceptors.response.use(
	(config) => {

		return config
	},
	(error) => {
		return Promise.reject(error)
	},
)

const getFormData = (object) => {
	const formData = new FormData()
	Object.keys(object).forEach((key) => formData.append(key, object[key]))
	return formData
}
const ApiServices = async (
	method = 'post',
	body,
	url = '',
	headers = {},
	formData = false,
	configExtras = {}
) => {
	const config = {
		method: method.toLowerCase(),
		timeout: 1000 * 60 * 2,
		...configExtras
	}
	if (url) {
		config.url = url
	}
	if (body && (method.toLowerCase() === 'get')) {
		config.params = body
	} else if (body && method.toLowerCase() === 'post' && !formData) {
		config.data = body
	} else if (body && method.toLowerCase() === 'post' && formData) {
		config.data = getFormData(body)
	} else {
		config.data = body
	}
	if (headers) {
		config.headers = headers
	}

	return new Promise((resolve, reject) => {
		axiosInstance(config)
			.then(async (res) => {
				let response = res.data
				resolve(response);
			})
			.catch(async (error) => {
				if (error.response) {
					if (error.response.status === 400) {
						reject(error)
						return
					}
					if (error.response.status === 401) {
						localStorage.removeItem('authUser')
						store.dispatch(logoutUser())
						history.replace('/')
						return;
					}
					if (error.response.status === 403) {
						reject(error)
						return
					}
					if (error.response.status === 404) {
						reject(error)
						return
					}
					if (error.response.status === 500) {
						reject(error)
						return
					}
					if (error.response.status === 409) {
						alert(error.response.data.message);
					}

					if (error.response.status === 502 || error.response.status === 404) {
						// Utility.showToast('Something went wrong, Please try again later.')
					}
					// if (error.response.data?.message) {
					//   // Utility.showToast(error.response.data.message)
					// }
					// resolve({
					//   status: error.response.status,
					//   data: error.response.data,
					//   data: error.response.data,
					// })          
					resolve(error.response.data);
					return
				}
				// Utility.showToast('Something went wrong, Please try again later.')
				reject(error)
			})
	})
}

export default ApiServices;
