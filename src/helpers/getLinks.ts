import { IGetOrderParams, IGetUserParams } from '@/interfaces/IGetParams';

export const getLinks = (params: (IGetUserParams | IGetOrderParams) & { totalItems: number }, resourceType: 'user' | 'order'): Record<string, string | null> => {
    const { totalItems, offset, limit, ...restParams } = params;
    const totalPages = Math.ceil(totalItems / limit);
    const searchParams = new URLSearchParams();

    Object.entries(restParams).forEach(([key, value]) => {
        if (value) {
            searchParams.append(key, value.toString());
        }
    });

    const linkStr = `/${resourceType}?${searchParams.toString()}&`;

    const links: Record<string, string | null> = {
        next: offset + limit < totalItems ? `${linkStr}offset=${offset + limit}&limit=${limit}` : null,
        prev: offset - limit >= 0 ? `${linkStr}offset=${offset - limit}&limit=${limit}` : null,
        first: totalItems > limit ? `${linkStr}offset=0&limit=${limit}` : null,
        last: totalItems > limit ? `${linkStr}offset=${(totalPages - 1) * limit}&limit=${limit}` : null
    };

    for (let page = 1; page <= totalPages; page++) {
        const pageOffset = (page - 1) * limit;
        if (totalPages !== 1) {
            links[`page${page}`] = `${linkStr}offset=${pageOffset}&limit=${limit}`;
        }
    }

    return links;
}
