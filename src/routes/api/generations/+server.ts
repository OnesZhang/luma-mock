import type { RequestHandler, RequestEvent } from './$types';
import { json } from '@sveltejs/kit';
import { config } from '$lib/config';

const access_token = config.ACCESS_TOKEN;
const baseUrl = config.PROXY_URL + '/api/photon/v1/user/generations/';

export const GET = (async (req: RequestEvent) => {
	if (!access_token) return json({ message: '缺少必要参数：access_token' }, { status: 400 });

	const offset = req.url.searchParams.get('offset') || '0';
	const limit = req.url.searchParams.get('limit') || '10';

	const url = new URL(baseUrl);
	url.searchParams.append('offset', offset);
	url.searchParams.append('limit', limit);

	try {
		const res = await fetch(`${url.toString()}`, {
			method: 'GET',
			headers: {
				Cookie: `luma_session=${access_token}`
			}
		});

		if (!res.ok) {
			const error = await res.json();
			throw new Error(error?.detail?.reason ?? error?.detail ?? 'Failed to fetch');
		}

		const data = await res.json();
		return json({ data }, { status: 200 });
	} catch (error: any) {
		return json({ message: error?.message || 'Internal Server Error' }, { status: 500 });
	}
}) satisfies RequestHandler;
