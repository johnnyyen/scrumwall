package com.scrumwall.gwt;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.util.Assert;

import com.google.gwt.user.client.rpc.SerializationException;
import com.google.gwt.user.server.rpc.RPC;
import com.google.gwt.user.server.rpc.RPCRequest;
import com.google.gwt.user.server.rpc.RemoteServiceServlet;

public final class DispatcherServlet extends RemoteServiceServlet {

	  private static final Log LOG = LogFactory.getLog(DispatcherServlet.class);

	  private static final long serialVersionUID = 1L;

	  /**
	   * A simple cache containing GWT RPC handlers registered on application
	   * startup
	   */
	  private final RpcFacadeLocator servicesProvider;

	  public DispatcherServlet(final RpcFacadeLocator servicesProvider) {
	    Assert.notNull(servicesProvider);
	    this.servicesProvider = servicesProvider;
	  }

	  /**
	   * {@inheritDoc}
	   */
	  @Override
	  public String processCall(final String payload) throws SerializationException {
	    final RPCRequest request = RPC.decodeRequest(payload, null, this);

	    try {
	      final Object handler = getHandler(request);

	      return RPC.invokeAndEncodeResponse(handler, request.getMethod(), request
	          .getParameters(), request.getSerializationPolicy());
	    } catch (final Exception e) {
	      LOG.error(e, e);
	      return RPC.encodeResponseForFailure(null, e);
	    }
	  }

	  /**
	   * Attempts to get an appropriate handler for the incoming RPC request
	   *
	   * @param request
	   *          the incoming RPC request
	   * @return an appropriate handler for the request
	   * @throws DispatchException
	   *           if the handler is not found in the cache (i.e. if there was none
	   *           registered during startup)
	   */
	  private Object getHandler(final RPCRequest request) throws IllegalStateException {
	    final Class<?> type = request.getMethod().getDeclaringClass();
	    final Object handler = servicesProvider.getRpcHandler(type);

	    if (handler == null) {
	      final IllegalStateException e = new IllegalStateException("No handler of type \""
	          + type.getName() + "\" found for request");
	      LOG.error(e);

	      throw e;
	    }

	    return handler;
	  }
}