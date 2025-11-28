package ro.cabinetpro.cp_gwt.filter;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import ro.cabinetpro.cp_gwt.context.RequestContext;

import java.io.IOException;

@Component
public class AuthHeaderFilter implements Filter {

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain
    ) throws IOException, ServletException {

        HttpServletRequest http = (HttpServletRequest) request;

        String token = http.getHeader("Authorization");
        RequestContext.setToken(token);

        try {
            chain.doFilter(request, response);
        } finally {
            RequestContext.clear();
        }
    }
}
