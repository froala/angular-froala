describe("froala", function () {

    var $compile;
    var $rootScope;
    var element = null;
    var view = null;
    var elementHtml = null;
    var viewHtml = null;
    var froalaEditorStub = null;
    var froalaEditorOnStub = null;
    var froalaEditorOffStub = null;

    // Load the froala module, which contains the directive
    beforeEach(module('froala'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$compile_, _$rootScope_, froalaConfig) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;

        froalaConfig.placeholderText = 'Placeholder';
        elementHtml = "<div froala='froalaOptions' ng-model='content'></div>";
        viewHtml = "<div froala-view='content'></div>";
    }));

    var compileElement = function (extraSetup) {
        setupFroalaEditorStub();
        populateScope($rootScope);
        if (extraSetup && typeof extraSetup === 'function') {
            extraSetup();
        }

        element = $compile(elementHtml)($rootScope);
    };

    var compileViewElement = function () {
    	view = $compile(viewHtml)($rootScope);
    };

    var setupFroalaEditorStub = function () {
        froalaEditorStub = sinon.stub();
        froalaEditorOnStub = sinon.stub();
        froalaEditorOffStub = sinon.stub();

        froalaEditorStub.returns({
            data: function () {
                return {$el: {on: froalaEditorOnStub, off: froalaEditorOffStub}};
            }
        });

        angular.element.fn.froalaEditor = froalaEditorStub;
    };

    var populateScope = function (scope) {
        if (scope.froalaOptions === undefined) {
            scope.froalaOptions = {};
        }
        scope.froalaOptions.disableRightClick = true;
        scope.content = '';
    };

    var createEditorInManualMode = function (moreFroalaOptions) {
        elementHtml = "<div froala='froalaOptions' ng-model='content' froala-init='initEditor(initControls)'></div>";
        compileElement(function () {
            $rootScope.initEditor = function (initControls) {
                $rootScope.initControls = initControls;

                $rootScope.froalaOptions = angular.extend($rootScope.froalaOptions, moreFroalaOptions);

            };
        });
    };

    it('Requires ngModel attribute', function () {
        expect(function () {
            $compile("<div froala></div>")($rootScope);
        }).toThrow();
    });

    it('Adds an ID to the html element', function () {
        compileElement();

        expect(element.attr('id')).toEqual('froala-0');
    });

    it('Combines the global and local configuration options', function () {
        compileElement();

        expect(froalaEditorStub.args[0][0].placeholderText).toEqual('Placeholder');
        expect(froalaEditorStub.args[0][0].disableRightClick).toBeTruthy();
    });

    it('Uses default option values when no options are provided', function () {
        compileElement();

        expect(froalaEditorStub.args[0][0].immediateAngularModelUpdate).toBeFalsy();
    });

    it('Can overwrite default options', function () {
        $rootScope.froalaOptions = {immediateAngularModelUpdate: true};
        compileElement();

        expect(froalaEditorStub.args[0][0].immediateAngularModelUpdate).toBeTruthy();
    });

    it('Returns the instantiated editor in the options', function () {
        compileElement();

        expect($rootScope.froalaOptions.froalaEditor).toBeDefined();
    });

    it('Considers tags with whitespaces as empty content', function () {
        elementHtml = "<input froala='froalaOptions' ng-model='content' required/>";
        compileElement();

        $rootScope.content = '   <i>      </i>  ';
        $rootScope.$digest();

        expect(element.attr('class')).toContain('ng-invalid');
    });

    it('Registers the Key Up event', function () {
        $rootScope.froalaOptions = {immediateAngularModelUpdate: true};
        compileElement();

        expect(froalaEditorOnStub.args[0][0]).toEqual('keyup');
    });

    it('Does not register the Key Up event if immediateAngularModelUpdate is false', function () {
        $rootScope.froalaOptions = {immediateAngularModelUpdate: false};
        compileElement();

        expect(froalaEditorOnStub.args.length).toEqual(0);
    });

    it('Destroys editor when directive is destroyed', function () {
        compileElement();

        $rootScope.$destroy();

        expect(froalaEditorStub.args[1][0]).toEqual('destroy');
    });


    it('Updates the model after a key is released when option for immediate update is activated', function () {
        $rootScope.froalaOptions = {immediateAngularModelUpdate: true};
        compileElement(function () {
            froalaEditorStub.onSecondCall().returns('My String');
        });

        froalaEditorOnStub.callArgOn(1);
        $rootScope.$digest();

        expect($rootScope.content).toEqual('My String');
    });

    it('Updates the model after the froala editor content has changed', function () {
        compileElement(function () {
            froalaEditorStub.onSecondCall().returns('My String');
        });

        element.trigger('froalaEditor.contentChanged');
        $rootScope.$digest();

        expect($rootScope.content).toEqual('My String');
    });

    it('Updates the froala editor and reset the undo stack after the model changes', function () {
        compileElement();

        $rootScope.content = '<i>New Text</i>';
        $rootScope.$digest();
        element.trigger('froalaEditor.initialized');

        expect(froalaEditorStub.getCall(1).args[0]).toEqual('html.set');
        expect(froalaEditorStub.getCall(1).args[1]).toEqual('<i>New Text</i>');

        expect(froalaEditorStub.getCall(2).args[0]).toEqual('undo.reset');

    });

    it('Allows to register event handlers', function () {
        var callbackSpy = sinon.spy();
        compileElement(function () {
            $rootScope.froalaOptions.events = {
                'froalaEditor.focus': callbackSpy
            };
        });

        element.trigger('froalaEditor.focus');

        expect(callbackSpy.called).toBeTruthy();
    });

    it('Does not initialize the editor when in manual mode', function () {
        createEditorInManualMode();
        expect(froalaEditorStub.called).toBeFalsy();
    });


    it('Manually controls when the editor is instantiated', function () {
        createEditorInManualMode();

        $rootScope.initControls.initialize();

        expect(froalaEditorStub.called).toBeTruthy();
    });

    it('Manually controls when the editor is destroyed', function () {
        createEditorInManualMode();

        $rootScope.initControls.initialize();
        $rootScope.initControls.destroy();

        expect(froalaEditorStub.args[1][0]).toEqual('destroy');
    });

    it('Does not re-initialize the editor once instantiated', function () {
        createEditorInManualMode();

        $rootScope.initControls.initialize();
        element.trigger('froalaEditor.initialized');

        $rootScope.initControls.initialize();

        expect(froalaEditorStub.callCount).toEqual(4); // 1 for creating editor and 3 after initialized event
    });

    it('Can re-initialize the editor after closing it', function () {
        createEditorInManualMode();

        $rootScope.initControls.initialize();
        $rootScope.initControls.destroy();
        $rootScope.initControls.initialize();

        expect(froalaEditorStub.callCount).toEqual(3); //init, close and init again
    });

    it('Returns the editor after initialing it', function () {
        createEditorInManualMode();

        $rootScope.initControls.initialize();

        expect($rootScope.initControls.getEditor()).toBeDefined();
    });

    it('Returns a NULL editor if it was not manually initialized', function () {
        createEditorInManualMode();

        expect($rootScope.initControls.getEditor()).toBeNull();
    });

    it('Allows create then destroy then create with options preserved', function() {
        var linkList = [
            {
                text: 'MSN',
                href: 'http://www.msn.com'
            },
            {
                text: 'NY Times',
                href: 'http://www.nytimes.com',
                rel: 'nofollow'
            },
            {
                displayText: 'Tellwise',
                href: 'http://www.tellwise.com',
                target: '_blank'
            },
            {
                text: 'Bing',
                displayText: 'Bing',
                href: 'http://www.bing.com',
                target: '_blank',
                rel: 'nofollow'
            }
        ];
        createEditorInManualMode({
            linkList: linkList
        });

        //
        // First initialize
        //
        $rootScope.initControls.initialize();
        expect($rootScope.initControls.getEditor()).toBeDefined();

        //
        // Destroy
        //
        $rootScope.initControls.destroy();

        //
        // Second initialize
        //
        $rootScope.initControls.initialize();
        expect($rootScope.initControls.getEditor()).toBeDefined();

        //
        // Would be nice to verify that the linkList is applied to froalaEditor
        //

    });

	it('Sets the view to the value of the model', function () {
				$rootScope.content = '<i>New Text</i>';

				compileViewElement();
				$rootScope.$digest();

      	expect(view.html()).toEqual("<i>New Text</i>");
	});

    it('Sets options when the editor is instantiated manually', function () {
        createEditorInManualMode();

        $rootScope.initControls.initialize({initOnClick: false});

        expect(froalaEditorStub.called).toBeTruthy();
        expect(froalaEditorStub.args[0][0].initOnClick).toBeFalsy();
    });
});