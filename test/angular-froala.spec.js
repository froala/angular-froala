describe("froala", function () {

    var $compile;
    var $rootScope;
    var element = null;
    var elementHtml = null;
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
    }));

    var compileElement = function (extraSetup) {
        setupFroalaEditorStub();
        if (extraSetup && typeof extraSetup === 'function') {
            extraSetup();
        }
        populateScope($rootScope);

        element = $compile(elementHtml)($rootScope);
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
        scope.froalaOptions = {
            initOnClick: true
        };
        scope.content = '';
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
        expect(froalaEditorStub.args[0][0].initOnClick).toBeTruthy();
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
        compileElement();

        expect(froalaEditorOnStub.args[0][0]).toEqual('keyup');
    });

    it('Destroys editor when directive is destroyed', function () {
        compileElement();

        $rootScope.$destroy();

        expect(froalaEditorStub.args[1][0]).toEqual('destroy');
    });


    it('Updates the model after a key is released', function () {
        compileElement(function () {
            froalaEditorStub.onSecondCall().returns('My String');
        });

        froalaEditorOnStub.callArgOn(1);

        expect($rootScope.content).toEqual('My String');
    });

    it('Updates the model after the froala editor content has changed', function () {
        compileElement(function () {
            froalaEditorStub.onSecondCall().returns('My String');
        });

        element.trigger('froalaEditor.contentChanged');

        expect($rootScope.content).toEqual('My String');
    });

    it('Updates the froala editor and reset the undo stack after the model changes', function () {
        compileElement();

        $rootScope.content = '<i>New Text</i>';
        $rootScope.$digest();

        expect(froalaEditorStub.getCall(1).args[0]).toEqual('html.set');
        expect(froalaEditorStub.getCall(1).args[1]).toEqual('<i>New Text</i>');

        expect(froalaEditorStub.getCall(2).args[0]).toEqual('undo.reset');

    });
});